import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CouponDocument } from '../src/database/schemas/coupon.schema';
import { UserDocument } from '../src/database/schemas/user.schema';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('CouponsModule (e2e)', () => {
    let app: INestApplication;
    let couponModel: Model<CouponDocument>;
    let userModel: Model<UserDocument>;
    let adminAccessToken: string;
    let userAccessToken: string;
    let testTourId = '65d123456789012345678901'; // Mock ID
    let couponId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        app.useGlobalInterceptors(new TransformInterceptor());
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();

        couponModel = moduleFixture.get<Model<CouponDocument>>(getModelToken('Coupon'));
        userModel = moduleFixture.get<Model<UserDocument>>(getModelToken('User'));
    }, 30000);

    // For E2E, I'll use a simpler approach for auth in this test.
    // I'll reuse the setup from other E2E tests if available.

    // Let's just mock the login by getting a token directly if possible, 
    // but Supertest needs to go through the app.

    // I'll use the register -> verify -> login flow.

    const registerUser = async (email: string, role: string = 'customer') => {
        const regRes = await request(app.getHttpServer())
            .post('/api/auth/register')
            .send({ name: 'Test User', email, password: 'Password123!', phone: Math.random().toString().slice(2, 12), gender: 'male', dateOfBirth: '1990-01-01' });

        if (regRes.status !== 201)
        {
            console.error('Registration failed:', regRes.body);
        }

        const user = await userModel.findOne({ email });
        if (user)
        {
            user.isVerified = true;
            user.role = role as any;
            await user.save();
        }

        const loginRes = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({ identifier: email, password: 'Password123!' });

        if (loginRes.status !== 200 && loginRes.status !== 201)
        {
            console.error('Login failed:', loginRes.status, loginRes.body);
        }

        return loginRes.body?.data?.accessToken;
    };

    beforeAll(async () => {
        // App already init above
        adminAccessToken = await registerUser('admin-c@test.com', 'admin');
        userAccessToken = await registerUser('user-c@test.com', 'customer');
    });

    afterAll(async () => {
        await couponModel.deleteMany({});
        await userModel.deleteMany({ email: { $in: ['admin-c@test.com', 'user-c@test.com'] } });
        await app.close();
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

            const deleted = await couponModel.findById(couponId);
            expect(deleted).toBeNull();
        });
    });
});
