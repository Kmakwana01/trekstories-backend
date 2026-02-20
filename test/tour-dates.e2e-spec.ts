import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { Connection, Types } from 'mongoose';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';

describe('TourDates (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let adminToken: string;
    let customerToken: string;
    let testTourId: string;
    let testTourDateId: string;

    let context: E2EContext;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        connection = context.connection;
        adminToken = context.adminToken;
        customerToken = context.customerToken;

        await clearTestData(connection);

        // Setup test tour
        const tour = await connection.collection('tours').insertOne({
            title: 'Test Tour Dates',
            slug: 'test-tour-dates',
            basePrice: 1000,
            category: 'Adventure',
            location: 'Himalayas',
            state: 'HP',
            country: 'India',
            isActive: true,
            viewCount: 0,
            averageRating: 0,
            reviewCount: 0,
            departureOptions: [
                { fromCity: 'Test City', type: 'AC', totalDays: 5, totalNights: 4, priceAdjustment: 0 }
            ]
        });
        testTourId = tour.insertedId.toString();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Admin Tour Dates', () => {
        it('/admin/tour-dates (POST) - should create tour date', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/api/admin/tour-dates')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    tour: testTourId,
                    startDate: new Date(Date.now() + 86400000).toISOString(),
                    endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
                    totalSeats: 30,
                    priceOverride: 1200,
                    departureNote: 'Meeting at HQ',
                });

            expect(res.status).toBe(201);
            expect(res.body.data.totalSeats).toBe(30);
            testTourDateId = res.body.data._id;
        });

        it('/admin/tour-dates (POST) - should fail if not admin', async () => {
            const res = await supertest(app.getHttpServer())
                .post('/api/admin/tour-dates')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    tour: testTourId,
                    startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
                    endDate: new Date(Date.now() + 86400000 * 15).toISOString(),
                    totalSeats: 20,
                });

            expect(res.status).toBe(403);
        });

        it('/admin/tour-dates/:tourId (GET) - should get all dates for tour', async () => {
            const res = await supertest(app.getHttpServer())
                .get(`/api/admin/tour-dates/${testTourId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });

    describe('Public Tour Dates', () => {
        it('/tour-dates/:tourId (GET) - should get upcoming dates', async () => {
            const res = await supertest(app.getHttpServer())
                .get(`/api/tour-dates/${testTourId}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });

    describe('Status Updates', () => {
        it('/admin/tour-dates/:id/status (PATCH) - should update status', async () => {
            const res = await supertest(app.getHttpServer())
                .patch(`/api/admin/tour-dates/${testTourDateId}/status`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ status: 'full' });

            expect(res.status).toBe(200);
            expect(res.body.data.status).toBe('full');
        });

        it('/admin/tour-dates/auto-update-status (POST) - should trigger auto update', async () => {
            // Create an old date to test auto-completion
            await connection.collection('tourdates').insertOne({
                tour: new Types.ObjectId(testTourId),
                startDate: new Date(Date.now() - 86400000 * 10),
                endDate: new Date(Date.now() - 86400000 * 5),
                totalSeats: 10,
                bookedSeats: 0,
                status: 'upcoming',
                isActive: true
            });

            const res = await supertest(app.getHttpServer())
                .post('/api/admin/tour-dates/auto-update-status')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(201);
            expect(res.body.data).toContain('Updated');
        });
    });

    describe('Clean Soft Delete', () => {
        it('/admin/tour-dates/:id (DELETE) - should delete date', async () => {
            const res = await supertest(app.getHttpServer())
                .delete(`/api/admin/tour-dates/${testTourDateId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);

            const findRes = await connection.collection('tourdates').findOne({ _id: new Types.ObjectId(testTourDateId) });
            expect(findRes).toBeNull();
        });
    });
});
