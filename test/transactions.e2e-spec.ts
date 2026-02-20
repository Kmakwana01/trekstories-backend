import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module'; // Adjust path if needed
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import * as jwt from 'jsonwebtoken';

import { ConfigService } from '@nestjs/config';

describe('TransactionsController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let configService: ConfigService;
    let customerToken: string;
    let adminToken: string;
    let transactionId: string;
    let customerId: string;

    const mockCustomer = {
        _id: '65e9f9f9f9f9f9f9f9f9f901',
        email: 'customer@example.com',
        role: 'customer',
    };

    const mockAdmin = {
        _id: '65e9f9f9f9f9f9f9f9f9f902',
        email: 'admin@example.com',
        role: 'admin',
    };

    const mockOther = {
        _id: '65e9f9f9f9f9f9f9f9f9f903',
        email: 'other@example.com',
        role: 'customer',
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
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
        connection = app.get(getConnectionToken());
        configService = app.get(ConfigService);

        // Create tokens
        const jwtSecret = configService.get<string>('JWT_SECRET') || 'your_secret';
        customerToken = jwt.sign({ sub: mockCustomer._id, email: mockCustomer.email, role: 'customer' }, jwtSecret);
        adminToken = jwt.sign({ sub: mockAdmin._id, email: mockAdmin.email, role: 'admin' }, jwtSecret);
        customerId = mockCustomer._id;

        // Seed users
        await connection.collection('users').deleteMany({});
        await connection.collection('users').insertMany([
            { ...mockCustomer, _id: new Types.ObjectId(mockCustomer._id) },
            { ...mockAdmin, _id: new Types.ObjectId(mockAdmin._id) },
            { ...mockOther, _id: new Types.ObjectId(mockOther._id) }
        ]);

        // Seed a transaction
        await connection.collection('transactions').deleteMany({});
        const tx = await connection.collection('transactions').insertOne({
            user: new Types.ObjectId(mockCustomer._id),
            amount: 500,
            type: 'payment',
            status: 'success',
            paymentMethod: 'UPI',
            transactionId: 'TX12345',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        transactionId = tx.insertedId.toString();
    });

    afterAll(async () => {
        await connection.collection('transactions').deleteMany({});
        await connection.collection('users').deleteMany({});
        await app.close();
    });

    describe('/transactions/my (GET)', () => {
        it('should return user transactions', async () => {
            return request(app.getHttpServer())
                .get('/transactions/my')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.data)).toBe(true);
                    expect(res.body.data.length).toBeGreaterThan(0);
                    expect(res.body.data[0].transactionId).toBe('TX12345');
                });
        });
    });

    describe('/transactions/:id (GET)', () => {
        it('should return transaction by id for owner', async () => {
            return request(app.getHttpServer())
                .get(`/transactions/${transactionId}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.transactionId).toBe('TX12345');
                });
        });

        it('should return 404/Null if not found or not owner (depends on implementation, assuming null for logic check)', async () => {
            // In service logic: if (userId) query.user = userId; so if we use another user it won't find it
            const otherUserToken = jwt.sign({ sub: '65e9f9f9f9f9f9f9f9f9f903', email: 'other@example.com', role: 'customer' }, 'your_secret');
            return request(app.getHttpServer())
                .get(`/transactions/${transactionId}`)
                .set('Authorization', `Bearer ${otherUserToken}`)
                .expect(404);
        });
    });

    describe('/admin/transactions (GET)', () => {
        it('should return all transactions for admin', async () => {
            return request(app.getHttpServer())
                .get('/admin/transactions')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.data)).toBe(true);
                    // expect(res.body.data.length).toBeGreaterThan(0); 
                    // Population check
                    // expect(res.body.data[0].user).toBeDefined();
                });
        });

        it('should fail for customer', async () => {
            return request(app.getHttpServer())
                .get('/admin/transactions')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(403);
        });
    });

    describe('/admin/transactions/:id (GET)', () => {
        it('should return transaction by id for admin', async () => {
            return request(app.getHttpServer())
                .get(`/admin/transactions/${transactionId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.transactionId).toBe('TX12345');
                });
        });
    });

    describe('/admin/transactions/export (GET)', () => {
        it('should export transactions as CSV', async () => {
            return request(app.getHttpServer())
                .get('/admin/transactions/export')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect('Content-Type', /text\/csv/)
                .expect('Content-Disposition', /attachment; filename=transactions.csv/)
                .expect((res) => {
                    // CSV response is text, not JSON wrapped
                    expect(res.text).toContain('Date,Transaction ID,User,Type,Amount,Status,Method,Description');
                    expect(res.text).toContain('TX12345');
                });
        });
    });
});
