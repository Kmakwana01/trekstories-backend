import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { Connection, Types } from 'mongoose';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';

describe('Bookings Module (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let accessToken: string;
    let adminToken: string;
    let tourId: string;
    let tourDateId: string;
    let bookingId: string;

    let context: E2EContext;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        connection = context.connection;
        accessToken = context.customerToken;
        adminToken = context.adminToken;

        await clearTestData(connection);

        // 3. Create a Tour and Tour Date for testing
        const tourRes = await supertest(app.getHttpServer())
            .post('/api/admin/tours')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'E2E Test Tour',
                description: 'Description',
                basePrice: 1000,
                state: 'State',
                location: 'Location',
                category: '659c00000000000000000000',
                departureOptions: [{
                    fromCity: 'City A',
                    type: 'AC',
                    totalDays: 3,
                    totalNights: 2,
                    priceAdjustment: 200
                }]
            });
        if (tourRes.status !== 201)
        {
            throw new Error(`Tour Creation Failed: ${JSON.stringify(tourRes.body)}`);
        }
        tourId = tourRes.body.data._id;

        const dateRes = await supertest(app.getHttpServer())
            .post('/api/admin/tour-dates')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                tour: tourId,
                startDate: new Date(Date.now() + 86400000).toISOString(),
                endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
                totalSeats: 20
            });
        if (dateRes.status !== 201)
        {
            throw new Error(`Tour Date Creation Failed: ${JSON.stringify(dateRes.body)}`);
        }
        tourDateId = dateRes.body.data._id;
    });

    afterAll(async () => {
        await app.close();
    });

    it('/api/bookings/preview (POST) - should return price breakdown', async () => {
        const res = await supertest(app.getHttpServer())
            .post('/api/bookings/preview')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                tourDateId,
                pickupOptionIndex: 0,
                travelerCount: 2
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.subtotal).toBe(2400); // (1000 + 200) * 2
        expect(res.body.data.totalAmount).toBe(2520); // 2400 + 120 (5% GST)
    });

    it('/api/bookings/create (POST) - should create booking', async () => {
        const res = await supertest(app.getHttpServer())
            .post('/api/bookings/create')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                tourDateId,
                pickupOptionIndex: 0,
                travelers: [
                    { fullName: 'Traveler 1', age: 25, gender: 'male' },
                    { fullName: 'Traveler 2', age: 24, gender: 'female' }
                ]
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.bookingNumber).toBeDefined();
        expect(res.body.data.pricingSummary).toBeDefined();
        bookingId = res.body.data._id;
    });

    it('/api/bookings/my-bookings (GET) - should return user bookings', async () => {
        const res = await supertest(app.getHttpServer())
            .get('/api/bookings/my-bookings')
            .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]._id).toBe(bookingId);
        expect(res.body.data[0].tourDate.availableSeats).toBeDefined();
        expect(res.body.data[0].tourDate.availableSeats).not.toBeNull();
    });

    it('/api/admin/bookings (GET) - should return all bookings for admin', async () => {
        const res = await supertest(app.getHttpServer())
            .get('/api/admin/bookings')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('/api/admin/bookings/:id/confirm (PATCH) - should confirm booking and update seats', async () => {
        const res = await supertest(app.getHttpServer())
            .patch(`/api/admin/bookings/${bookingId}/confirm`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('confirmed');

        // Check tour date seats
        const dateRes = await supertest(app.getHttpServer())
            .get(`/api/tours/${tourId}/dates`);
        const updatedDate = dateRes.body.data.find(d => d._id === tourDateId);
        expect(updatedDate.bookedSeats).toBe(2);
    });

    it('/api/bookings/:id/cancel (DELETE) - should cancel booking and restore seats', async () => {
        const res = await supertest(app.getHttpServer())
            .delete(`/api/bookings/${bookingId}/cancel`)
            .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('cancelled');

        // Check tour date seats again
        const dateRes = await supertest(app.getHttpServer())
            .get(`/api/tours/${tourId}/dates`);
        const updatedDate = dateRes.body.data.find(d => d._id === tourDateId);
        expect(updatedDate.bookedSeats).toBe(0);
    });
});
