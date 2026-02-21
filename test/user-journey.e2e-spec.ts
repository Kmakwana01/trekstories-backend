import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { join } from 'path';
import { writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';

describe('User Journey (e2e)', () => {
    let app: INestApplication;
    let context: E2EContext;
    let adminToken: string;
    let customerToken: string;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        adminToken = context.adminToken;
        customerToken = context.customerToken;

        // Ensure uploads directory exists for tests
        const uploadDir = join(process.cwd(), 'uploads', 'receipts');
        if (!existsSync(uploadDir))
        {
            mkdirSync(uploadDir, { recursive: true });
        }
    });

    afterAll(async () => {
        await teardownE2E(context);
        const dummyFilePath = join(process.cwd(), 'test-receipt.png');
        if (existsSync(dummyFilePath)) unlinkSync(dummyFilePath);
    });

    describe('Flow 1: Self-Service Payment & Booking Confirmation', () => {
        let tourId: string;
        let tourSlug: string;
        let tourDateId: string;
        let bookingId: string;

        it('Step 1: Admin creates a new tour and date', async () => {
            // 1. Create Tour
            const tourRes = await request(app.getHttpServer())
                .post('/api/admin/tours')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Journey Test Tour',
                    description: 'A tour for e2e journey testing',
                    basePrice: 5000,
                    location: 'Test City',
                    state: 'Test State',
                    category: 'adventure',
                    itinerary: [{ dayNumber: 1, title: 'Arrival', points: [{ text: 'Arrive at hotel' }] }],
                    departureOptions: [{ fromCity: 'Origin', toCity: 'Test City', type: 'AC', departureTimeAndPlace: '9 AM Station', totalDays: 2, totalNights: 1 }]
                });

            expect(tourRes.status).toBe(201);
            tourId = tourRes.body.data._id;
            tourSlug = tourRes.body.data.slug;

            // 2. Create Tour Date
            const dateRes = await request(app.getHttpServer())
                .post('/api/admin/tour-dates')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    tour: tourId,
                    startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                    endDate: new Date(Date.now() + 172800000).toISOString(),   // Day after
                    totalSeats: 10
                });

            expect(dateRes.status).toBe(201);
            tourDateId = dateRes.body.data._id;
        });

        it('Step 2: Customer browses and views tour details', async () => {
            // List tours
            await request(app.getHttpServer())
                .get('/api/tours')
                .expect(200);

            // Get tour by SLUG
            const detailRes = await request(app.getHttpServer())
                .get(`/api/tours/${tourSlug}`)
                .expect(200);

            expect(detailRes.body.data.title).toBe('Journey Test Tour');
        });

        it('Step 3: Customer creates a booking (Pending)', async () => {
            const bookingRes = await request(app.getHttpServer())
                .post('/api/bookings/create')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    tourDateId: tourDateId,
                    pickupOptionIndex: 0,
                    travelers: [
                        { fullName: 'Journey Traveler', age: 25, gender: 'male', phone: '1234567890', idNumber: 'ID123' }
                    ]
                });

            expect(bookingRes.status).toBe(201);
            bookingId = bookingRes.body.data._id;
            expect(bookingRes.body.data.status).toBe('pending');
        });

        it('Step 4: Customer submits payment proof (Under Review)', async () => {
            // Create a dummy file for upload
            const dummyFilePath = join(process.cwd(), 'test-receipt.png');
            writeFileSync(dummyFilePath, 'test-image-content');

            const uploadRes = await request(app.getHttpServer())
                .post('/api/payments/submit-proof')
                .set('Authorization', `Bearer ${customerToken}`)
                .attach('receiptImage', dummyFilePath)
                .field('bookingId', bookingId)
                .field('transactionId', 'TXN' + Date.now())
                .field('amount', 5000)
                .field('paymentMethod', 'upi');

            expect(uploadRes.status).toBe(201);
            expect(uploadRes.body.data.status).toBe('under_review');
        });

        it('Step 5: Admin approves payment (Booking Confirmed)', async () => {
            // Get pending payments
            const pendingRes = await request(app.getHttpServer())
                .get('/api/admin/payments/pending-review')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            // Note: booking is populated, so we check ._id
            const payment = pendingRes.body.data.find((p: any) => p.booking?._id?.toString() === bookingId.toString());
            expect(payment).toBeDefined();

            // Approve
            await request(app.getHttpServer())
                .patch(`/api/admin/payments/${payment._id}/approve`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            // Verify Booking Status
            const bookingRes = await request(app.getHttpServer())
                .get(`/api/bookings/${bookingId}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(200);

            expect(bookingRes.body.data.status).toBe('confirmed');
        });

        it('Step 6: Customer submits a review after trip (Pending Admin)', async () => {
            const reviewRes = await request(app.getHttpServer())
                .post('/api/reviews')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    bookingId: bookingId,
                    rating: 5,
                    comment: 'Everything was perfect.'
                });

            expect(reviewRes.status).toBe(201);
            expect(reviewRes.body.data.status).toBe('pending');
        });
    });

    describe('Flow 4: Concurrent Booking (Race Condition)', () => {
        let tourDateId: string;

        beforeAll(async () => {
            // Create a tour with 1 seat remaining
            const tourRes = await request(app.getHttpServer())
                .post('/api/admin/tours')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Race Condition Tour',
                    basePrice: 1000,
                    itinerary: [{ dayNumber: 1, title: 'No seats', points: [{ text: 'Sold out soon' }] }],
                    departureOptions: [{ fromCity: 'X', toCity: 'Y', type: 'AC', departureTimeAndPlace: 'Z', totalDays: 1, totalNights: 0 }]
                });

            expect(tourRes.status).toBe(201);

            const dateRes = await request(app.getHttpServer())
                .post('/api/admin/tour-dates')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    tour: tourRes.body.data._id,
                    startDate: new Date(Date.now() + 86400000).toISOString(),
                    endDate: new Date(Date.now() + 172800000).toISOString(),
                    totalSeats: 1
                });

            expect(dateRes.status).toBe(201);
            tourDateId = dateRes.body.data._id;
        });

        it('should allow only one success when 3 users book 1 remaining seat', async () => {
            const bookingData = {
                tourDateId: tourDateId,
                pickupOptionIndex: 0,
                travelers: [{ fullName: 'Racer', age: 30, gender: 'male', phone: '000', idNumber: '000' }]
            };

            const requests = [
                request(app.getHttpServer()).post('/api/bookings/create').set('Authorization', `Bearer ${customerToken}`).send(bookingData),
                request(app.getHttpServer()).post('/api/bookings/create').set('Authorization', `Bearer ${customerToken}`).send(bookingData),
                request(app.getHttpServer()).post('/api/bookings/create').set('Authorization', `Bearer ${customerToken}`).send(bookingData)
            ];

            const results = await Promise.all(requests);

            const successes = results.filter(r => r.status === 201);
            const failures = results.filter(r => r.status === 409 || r.status === 400);

            // Log statuses if failed
            if (successes.length !== 1 || failures.length !== 2)
            {
                console.log('Race results:', results.map(r => ({ status: r.status, body: r.body })));
            }

            expect(successes.length).toBe(1);
            expect(failures.length).toBe(2);
        });
    });
});
