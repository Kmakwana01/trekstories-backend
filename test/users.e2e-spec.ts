import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    const testEmail = `user-${Date.now()}@test.com`;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        app.useGlobalInterceptors(new TransformInterceptor());
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();

        // Register and login to get token
        await request(app.getHttpServer())
            .post('/api/auth/register')
            .send({
                name: 'User Tester',
                email: testEmail,
                password: 'password123',
                phone: `+918${Date.now().toString().slice(-9)}`,
            });

        const loginRes = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                identifier: testEmail,
                password: 'password123',
            });

        accessToken = loginRes.body.data.accessToken;
    }, 30000);

    afterAll(async () => {
        await app.close();
    });

    it('/users/profile (GET) - Get Profile', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body.data.email).toBe(testEmail);
    });

    it('/api/users/profile (PATCH) - Update Profile', async () => {
        const response = await request(app.getHttpServer())
            .patch('/api/users/profile')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                name: 'Updated Name',
                country: 'India',
                gender: 'female',
                dateOfBirth: '1995-05-05'
            })
            .expect(200);

        expect(response.body.data.name).toBe('Updated Name');
        expect(response.body.data.gender).toBe('female');
        expect(response.body.data.dateOfBirth).toBeDefined();
    });

    it('/api/users/travelers (POST) - Add Traveler', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/users/travelers')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                fullName: 'Saved Traveler',
                age: 25,
                gender: 'female',
                idNumber: 'ID12345',
            })
            .expect(201);

        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data[0].fullName).toBe('Saved Traveler');
    });

    it('/users/travelers (GET) - Get Travelers', async () => {
        const response = await request(app.getHttpServer())
            .get('/api/users/travelers')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(response.body.data).toHaveLength(1);
    });
});
