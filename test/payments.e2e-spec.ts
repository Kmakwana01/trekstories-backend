import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { Connection } from 'mongoose';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';
import * as path from 'path';

describe('PaymentsController (e2e)', () => {
    let app: INestApplication;
    let dbConnection: Connection;
    let accessToken: string;
    let adminToken: string;
    let tourId: string;
    let tourDateId: string;
    let bookingId: string;
    let paymentId: string;

    let context: E2EContext;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        dbConnection = context.connection;
        accessToken = context.customerToken;
        adminToken = context.adminToken;

        // Create Tour & Date
        const tourRes = await supertest(app.getHttpServer())
            .post('/api/admin/tours')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'Payment Tour',
                description: 'Desc',
                basePrice: 1000,
                category: '659c00000000000000000000',
                location: 'Loc',
                state: 'State',
                country: 'Country',
                departureOptions: [{ fromCity: 'City A', priceAdjustment: 0, type: 'AC', totalDays: 2, totalNights: 1 }]
            });
        if (!tourRes.body.data) throw new Error(`Tour create failed: ${JSON.stringify(tourRes.body)}`);
        tourId = tourRes.body.data._id;

        const dateRes = await supertest(app.getHttpServer())
            .post('/api/admin/tour-dates')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                tour: tourId, startDate: new Date(Date.now() + 86400000).toISOString(), endDate: new Date(Date.now() + 172800000).toISOString(), totalSeats: 10
            });
        if (!dateRes.body.data) throw new Error(`Date create failed: ${JSON.stringify(dateRes.body)}`);
        tourDateId = dateRes.body.data._id;
    });

    afterAll(async () => {
        await teardownE2E(context);
    }, 10000);

    it('Step 1: Create Booking', async () => {
        const res = await supertest(app.getHttpServer())
            .post('/api/bookings/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                tourDateId,
                pickupOptionIndex: 0,
                travelers: [{ fullName: 'T1', age: 20, gender: 'male' }]
            });
        expect(res.status).toBe(201);
        bookingId = res.body.data._id;
    });

    it('Step 2: Submit Payment Proof', async () => {
        const res = await supertest(app.getHttpServer())
            .post('/api/payments/submit-proof')
            .set('Authorization', `Bearer ${accessToken}`)
            .field('bookingId', bookingId)
            .field('transactionId', 'TX123456')
            .field('paymentMethod', 'UPI')
            .attach('receiptImage', Buffer.from('fakeimage'), 'receipt.jpg');

        expect(res.status).toBe(201);
        expect(res.body.data.status).toBe('under_review');
        paymentId = res.body.data._id;
    });

    it('Step 3: Get Pending Payments (Admin)', async () => {
        const res = await supertest(app.getHttpServer())
            .get('/api/admin/payments/pending-review')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        const payment = res.body.data.find(p => p._id === paymentId);
        expect(payment).toBeDefined();
    });

    it('Step 4: Approve Payment (Admin)', async () => {
        const res = await supertest(app.getHttpServer())
            .patch(`/api/admin/payments/${paymentId}/approve`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('success');

        // Check booking confirmed
        const bookingRes = await supertest(app.getHttpServer())
            .get(`/api/bookings/${bookingId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(bookingRes.body.data.status).toBe('confirmed');
    });

    it('Step 5: Record Offline Payment (Admin)', async () => {
        // Create another booking
        const bookingRes = await supertest(app.getHttpServer())
            .post('/api/bookings/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                tourDateId,
                pickupOptionIndex: 0,
                travelers: [{ fullName: 'T2', age: 25, gender: 'female' }]
            });
        const newBookingId = bookingRes.body.data._id;
        const amount = bookingRes.body.data.totalAmount;

        const res = await supertest(app.getHttpServer())
            .post('/api/admin/payments/offline')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                bookingId: newBookingId,
                amount,
                paymentMethod: 'cash',
                notes: 'Collected at office'
            });

        expect(res.status).toBe(201);
        expect(res.body.data.status).toBe('success');

        // Check booking confirmed
        const checkRes = await supertest(app.getHttpServer())
            .get(`/api/bookings/${newBookingId}`)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(checkRes.body.data.status).toBe('confirmed');
        expect(checkRes.body.data.paidAmount).toBe(amount);
    });

    it('Step 5.1: Reject Payment (Admin)', async () => {
        // Create another booking and payment request
        const bookingRes = await supertest(app.getHttpServer())
            .post('/api/bookings/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                tourDateId,
                pickupOptionIndex: 0,
                travelers: [{ fullName: 'T3', age: 30, gender: 'male' }]
            });
        const rejectBookingId = bookingRes.body.data._id;

        const proofRes = await supertest(app.getHttpServer())
            .post('/api/payments/submit-proof')
            .set('Authorization', `Bearer ${accessToken}`)
            .field('bookingId', rejectBookingId)
            .field('transactionId', 'TXREJECT123')
            .field('paymentMethod', 'UPI')
            .attach('receiptImage', Buffer.from('fakeimage'), 'receipt.jpg');

        const rejectPaymentId = proofRes.body.data._id;

        const res = await supertest(app.getHttpServer())
            .patch(`/api/admin/payments/${rejectPaymentId}/reject`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ reason: 'Invalid ID' });

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('rejected');
        expect(res.body.data.rejectionReason).toBe('Invalid ID');
    });

    it('Step 5.2: Partial Offline Payment (Admin)', async () => {
        const bookingRes = await supertest(app.getHttpServer())
            .post('/api/bookings/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                tourDateId,
                pickupOptionIndex: 0,
                travelers: [{ fullName: 'T4', age: 35, gender: 'female' }]
            });
        const partialBookingId = bookingRes.body.data._id;
        const total = bookingRes.body.data.totalAmount;
        const partial = Math.floor(total / 2);

        // Record partial
        const res = await supertest(app.getHttpServer())
            .post('/api/admin/payments/offline')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                bookingId: partialBookingId,
                amount: partial,
                paymentMethod: 'cash',
                notes: 'Partial payment'
            });

        expect(res.status).toBe(201);

        const checkRes = await supertest(app.getHttpServer())
            .get(`/api/bookings/${partialBookingId}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(checkRes.body.data.status).toBe('on_hold');
        expect(checkRes.body.data.paidAmount).toBe(partial);
        expect(checkRes.body.data.pendingAmount).toBe(total - partial);

        // Pay remaining
        const remaining = total - partial;
        await supertest(app.getHttpServer())
            .post('/api/admin/payments/offline')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                bookingId: partialBookingId,
                amount: remaining,
                paymentMethod: 'cash',
                notes: 'Remaining payment'
            });

        const finalCheck = await supertest(app.getHttpServer())
            .get(`/api/bookings/${partialBookingId}`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(finalCheck.body.data.status).toBe('confirmed');
        expect(finalCheck.body.data.pendingAmount).toBe(0);
    });

    it('Step 6: Verify Transactions', async () => {
        // User check
        const userTxRes = await supertest(app.getHttpServer())
            .get('/api/transactions/my')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(userTxRes.status).toBe(200);
        expect(userTxRes.body.data.length).toBeGreaterThanOrEqual(1);
        expect(userTxRes.body.data[0].amount).toBeDefined();

        // Admin check
        const adminTxRes = await supertest(app.getHttpServer())
            .get('/api/admin/transactions')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(adminTxRes.status).toBe(200);
        expect(adminTxRes.body.data.length).toBeGreaterThanOrEqual(2); // One online, one offline
    });
});
