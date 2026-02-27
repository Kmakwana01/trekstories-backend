import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { Connection } from 'mongoose';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';

describe('Tours (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let adminToken: string;
    let tourId: string;
    let tourSlug: string;

    let context: E2EContext;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        connection = context.connection;
        adminToken = context.adminToken;
    });

    afterAll(async () => {
        await teardownE2E(context);
    });

    describe('Admin Flow', () => {
        it('/admin/tours (POST) - Create Tour', async () => {
            const response = await supertest(app.getHttpServer())
                .post('/api/admin/tours')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'E2E Himalayan Trek',
                    basePrice: 15000,
                    category: '659c00000000000000000000',
                    duration: '5 Days',
                    state: 'Himachal',
                    location: 'Kasol',
                    country: 'India',
                    isActive: true,
                    departureOptions: [
                        { fromCity: 'Kasol', type: 'AC', totalDays: 5, totalNights: 4, priceAdjustment: 0 }
                    ]
                })
                .expect(201);

            expect(response.body.data.title).toBe('E2E Himalayan Trek');
            expect(response.body.data.slug).toBeDefined();
            tourId = response.body.data._id;
            tourSlug = response.body.data.slug;
        });

        it('/admin/tours/:id (PATCH) - Update Tour', async () => {
            const response = await supertest(app.getHttpServer())
                .patch(`/api/admin/tours/${tourId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ basePrice: 16000 })
                .expect(200);

            expect(response.body.data.basePrice).toBe(16000);
        });
    });

    describe('Public Flow', () => {
        it('/tours (GET) - List Tours', async () => {
            const response = await supertest(app.getHttpServer())
                .get('/api/tours')
                .expect(200);

            expect(Array.isArray(response.body.data.items)).toBe(true);
        });

        it('/tours/:slug (GET) - Get Tour Details', async () => {
            const response = await supertest(app.getHttpServer())
                .get(`/api/tours/${tourSlug}`)
                .expect(200);

            expect(response.body.data.slug).toBe(tourSlug);
            expect(response.body.data.viewCount).toBeGreaterThan(0);
        });

        it('/tours/filter-options (GET)', async () => {
            const response = await supertest(app.getHttpServer())
                .get('/api/tours/filter-options')
                .expect(200);

            expect(response.body.data).toHaveProperty('states');
            expect(response.body.data).toHaveProperty('categories');
        });
    });
});
