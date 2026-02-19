import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Tour } from '../src/database/schemas/tour.schema';
import { User } from '../src/database/schemas/user.schema';
import { Role } from '../src/common/enums/roles.enum';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Wishlist (e2e)', () => {
    let app: INestApplication;
    let tourModel: any;
    let userModel: any;
    let jwtService: JwtService;

    let customerToken: string;
    let testTourId: string;

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
        userModel = app.get(getModelToken(User.name));
        jwtService = app.get(JwtService);

        // Setup test data
        await userModel.deleteMany({});
        await tourModel.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash('password123', salt);

        const customer = await userModel.create({
            name: 'Customer',
            email: 'user@wishlist.com',
            passwordHash: pass,
            role: Role.CUSTOMER,
            isVerified: true,
        });

        customerToken = jwtService.sign({ sub: customer._id, email: customer.email, role: customer.role });

        const tour = await tourModel.create({
            title: 'Wishlist Tour',
            slug: 'wishlist-tour',
            basePrice: 1000,
            category: 'Adventure',
            location: 'Himalayas',
            state: 'HP',
            country: 'India',
            isActive: true,
        });
        testTourId = tour._id.toString();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/api/wishlist/:tourId (POST) - should add to wishlist', async () => {
        const res = await supertest(app.getHttpServer())
            .post(`/api/wishlist/${testTourId}`)
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(201);
        expect(res.body.data.wishlist.some(t => t._id === testTourId)).toBe(true);
    });

    it('/api/wishlist (GET) - should get wishlist', async () => {
        const res = await supertest(app.getHttpServer())
            .get('/api/wishlist')
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0]._id).toBe(testTourId);
    });

    it('/api/wishlist/:tourId/toggle (POST) - should remove from wishlist when toggled', async () => {
        const res = await supertest(app.getHttpServer())
            .post(`/api/wishlist/${testTourId}/toggle`)
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(201);
        expect(res.body.data.added).toBe(false);
        expect(res.body.data.user.wishlist.some(t => t._id === testTourId)).toBe(false);
    });

    it('/api/wishlist/:tourId/toggle (POST) - should add to wishlist when toggled', async () => {
        const res = await supertest(app.getHttpServer())
            .post(`/api/wishlist/${testTourId}/toggle`)
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(201);
        expect(res.body.data.added).toBe(true);
        expect(res.body.data.user.wishlist.some(t => t._id === testTourId)).toBe(true);
    });

    it('/api/wishlist/:tourId (DELETE) - should remove from wishlist', async () => {
        const res = await supertest(app.getHttpServer())
            .delete(`/api/wishlist/${testTourId}`)
            .set('Authorization', `Bearer ${customerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.wishlist.some(t => t._id === testTourId)).toBe(false);
    });
});
