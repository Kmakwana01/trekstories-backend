import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/database/schemas/user.schema';
import { Role } from '../src/common/enums/roles.enum';

describe('Tours (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;
    let tourId: string;
    let tourSlug: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
        app.useGlobalInterceptors(new TransformInterceptor());
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();

        const adminEmail = `admin-${Date.now()}@test.com`;
        const adminPass = 'adminpassword';

        // 1. Register a fresh user
        await request(app.getHttpServer())
            .post('/api/auth/register')
            .send({
                name: 'Admin Tester',
                email: adminEmail,
                password: adminPass,
                phone: `+917${Date.now().toString().slice(-9)}`,
            })
            .expect(201);

        // 2. Elevate to Admin role directly via model
        const userModel = app.get(getModelToken(User.name));
        await userModel.findOneAndUpdate({ email: adminEmail }, { role: Role.ADMIN });

        // 3. Login to get Admin JWT
        const loginRes = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                identifier: adminEmail,
                password: adminPass,
            })
            .expect(201);

        adminToken = loginRes.body.data.accessToken;
    }, 30000);

    afterAll(async () => {
        await app.close();
    });

    describe('Admin Flow', () => {
        it('/admin/tours (POST) - Create Tour', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/admin/tours')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'E2E Himalayan Trek',
                    basePrice: 15000,
                    category: 'Trekking',
                    state: 'Himachal',
                    location: 'Kasol',
                    isActive: true,
                })
                .expect(201);

            expect(response.body.data.title).toBe('E2E Himalayan Trek');
            expect(response.body.data.slug).toBeDefined();
            tourId = response.body.data._id;
            tourSlug = response.body.data.slug;
        });

        it('/admin/tours/:id (PATCH) - Update Tour', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/api/admin/tours/${tourId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ basePrice: 16000 })
                .expect(200);

            expect(response.body.data.basePrice).toBe(16000);
        });
    });

    describe('Public Flow', () => {
        it('/tours (GET) - List Tours', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/tours')
                .expect(200);

            expect(Array.isArray(response.body.data.items)).toBe(true);
        });

        it('/tours/:slug (GET) - Get Tour Details', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/tours/${tourSlug}`)
                .expect(200);

            expect(response.body.data.slug).toBe(tourSlug);
            expect(response.body.data.viewCount).toBeGreaterThan(0);
        });

        it('/tours/filter-options (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/tours/filter-options')
                .expect(200);

            expect(response.body.data).toHaveProperty('states');
            expect(response.body.data).toHaveProperty('categories');
        });
    });
});
