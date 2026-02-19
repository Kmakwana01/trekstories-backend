import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    const testEmail = `e2e-${Date.now()}@test.com`;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.enableCors();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        app.useGlobalInterceptors(new TransformInterceptor());
        app.useGlobalFilters(new HttpExceptionFilter());
        await app.init();
    }, 30000); // Increase timeout for DB connection

    afterAll(async () => {
        await app.close();
    });

    it('/auth/register (POST) - Valid Registration', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/register')
            .send({
                name: 'E2E Tester',
                email: testEmail,
                phone: `+919${Date.now().toString().slice(-9)}`,
                password: 'password123',
            })
            .expect(201);

        expect(response.body.message).toContain('Registration successful');
        expect(response.body.data).toHaveProperty('accessToken');
    });

    let accessToken: string;
    let refreshToken: string;

    it('/auth/login (POST) - Success After Registration', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                identifier: testEmail,
                password: 'password123',
            })
            .expect(201);

        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data).toHaveProperty('refreshToken');
        accessToken = response.body.data.accessToken;
        refreshToken = response.body.data.refreshToken;
    });

    it('/auth/refresh (POST) - Success Refresh', async () => {
        const response = await request(app.getHttpServer())
            .post('/api/auth/refresh')
            .send({ refreshToken })
            .expect(201);

        expect(response.body.data).toHaveProperty('accessToken');
        expect(response.body.data).toHaveProperty('refreshToken');
        accessToken = response.body.data.accessToken;
        refreshToken = response.body.data.refreshToken;
    });

    it('/auth/logout (POST) - Success Logout', async () => {
        await request(app.getHttpServer())
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(201);
    });

    it('/api/auth/refresh (POST) - Fail After Logout', async () => {
        await request(app.getHttpServer())
            .post('/api/auth/refresh')
            .send({ refreshToken })
            .expect(403);
    });


    it('/auth/register (POST) - Invalid Data', () => {
        return request(app.getHttpServer())
            .post('/api/auth/register')
            .send({ email: 'bad-email' })
            .expect(400);
    });
});
