import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Tour } from '../src/database/schemas/tour.schema';
import { TourDate } from '../src/database/schemas/tour-date.schema';
import { User } from '../src/database/schemas/user.schema';
import { Role } from '../src/common/enums/roles.enum';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('TourDates (e2e)', () => {
    let app: INestApplication;
    let tourModel: any;
    let tourDateModel: any;
    let userModel: any;
    let jwtService: JwtService;

    let adminToken: string;
    let customerToken: string;
    let testTourId: string;
    let testTourDateId: string;

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

        tourModel = app.get(getModelToken(Tour.name));
        tourDateModel = app.get(getModelToken(TourDate.name));
        userModel = app.get(getModelToken(User.name));
        jwtService = app.get(JwtService);

        // Setup test data
        await userModel.deleteMany({});
        await tourModel.deleteMany({});
        await tourDateModel.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash('password123', salt);

        const admin = await userModel.create({
            name: 'Admin',
            email: 'admin@dates.com',
            passwordHash: pass,
            role: Role.ADMIN,
            isVerified: true,
        });

        const customer = await userModel.create({
            name: 'Customer',
            email: 'user@dates.com',
            passwordHash: pass,
            role: Role.CUSTOMER,
            isVerified: true,
        });

        adminToken = jwtService.sign({ sub: admin._id, email: admin.email, role: admin.role });
        customerToken = jwtService.sign({ sub: customer._id, email: customer.email, role: customer.role });

        const tour = await tourModel.create({
            title: 'Test Tour Dates',
            slug: 'test-tour-dates',
            basePrice: 1000,
            category: 'Adventure',
            location: 'Himalayas',
            state: 'HP',
            country: 'India',
        });
        testTourId = tour._id.toString();
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
                    startDate: '2026-05-01',
                    endDate: '2026-05-10',
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
                    startDate: '2026-06-01',
                    endDate: '2026-06-10',
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
            await tourDateModel.create({
                tour: testTourId,
                startDate: '2020-01-01',
                endDate: '2020-01-10',
                totalSeats: 10,
                status: 'upcoming'
            });

            const res = await supertest(app.getHttpServer())
                .post('/api/admin/tour-dates/auto-update-status')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(201);
            expect(res.body.data).toContain('Updated 1 to completed');
        });
    });

    describe('Clean Soft Delete', () => {
        it('/admin/tour-dates/:id (DELETE) - should delete date', async () => {
            const res = await supertest(app.getHttpServer())
                .delete(`/api/admin/tour-dates/${testTourDateId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(200);

            const findRes = await tourDateModel.findById(testTourDateId);
            expect(findRes).toBeNull();
        });
    });
});
