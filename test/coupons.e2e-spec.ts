import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection, Types } from 'mongoose';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';

describe('CouponsModule (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let adminAccessToken: string;
    let userAccessToken: string;
    let testTourId = '65d123456789012345678901'; // Mock ID
    let couponId: string;

    let context: E2EContext;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        connection = context.connection;
        adminAccessToken = context.adminToken;
        userAccessToken = context.customerToken;
    });

    afterAll(async () => {
        await teardownE2E(context);
    });

    describe('Admin Coupons CRUD', () => {
        it('POST /api/admin/coupons - should create a coupon', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/admin/coupons')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send({
                    code: 'SAVE20',
                    discountType: 'percent',
                    discountValue: 20,
                    minOrderAmount: 1000,
                    isActive: true
                });

            expect(res.status).toBe(201);
            expect(res.body.data.code).toBe('SAVE20');
            couponId = res.body.data._id;
        });

        it('GET /api/admin/coupons - should list coupons', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/admin/coupons')
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data.length).toBeGreaterThan(0);
        });

        it('PATCH /api/admin/coupons/:id - should update coupon', async () => {
            const res = await request(app.getHttpServer())
                .patch(`/api/admin/coupons/${couponId}`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send({ discountValue: 25 });

            expect(res.status).toBe(200);
            expect(res.body.data.discountValue).toBe(25);
        });
    });

    describe('Customer Coupon Validation', () => {
        it('POST /api/coupons/validate - should validate a valid coupon', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/coupons/validate')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send({
                    code: 'SAVE20',
                    tourId: testTourId,
                    orderAmount: 2000
                });

            expect(res.status).toBe(201); // Standard NestJS POST status
            expect(res.body.data.valid).toBe(true);
            expect(res.body.data.discountAmount).toBe(500); // 25% of 2000
        });

        it('POST /api/coupons/validate - should fail if below min order amount', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/coupons/validate')
                .set('Authorization', `Bearer ${userAccessToken}`)
                .send({
                    code: 'SAVE20',
                    tourId: testTourId,
                    orderAmount: 500
                });

            expect(res.status).toBe(400);
            expect(res.body.message).toContain('Minimum order amount');
        });
    });

    describe('Admin Coupon Deletion', () => {
        it('DELETE /api/admin/coupons/:id - should delete coupon', async () => {
            const res = await request(app.getHttpServer())
                .delete(`/api/admin/coupons/${couponId}`)
                .set('Authorization', `Bearer ${adminAccessToken}`);

            expect(res.status).toBe(200);

            const deleted = await connection.collection('coupons').findOne({ _id: new Types.ObjectId(couponId) });
            expect(deleted).toBeNull();
        });
    });
});
