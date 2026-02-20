import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { Connection, Types } from 'mongoose';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';

describe('TransactionsController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let customerToken: string;
    let adminToken: string;
    let transactionId: string;

    let context: E2EContext;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        connection = context.connection;
        customerToken = context.customerToken;
        adminToken = context.adminToken;

        await clearTestData(connection);

        // Get customer ID from token or use the customer account
        const customer = await connection.collection('users').findOne({ email: 'customer@e2e.com' });

        // Seed a transaction
        const tx = await connection.collection('transactions').insertOne({
            user: customer!._id,
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
        await clearTestData(connection);
        await app.close();
    });

    describe('/transactions/my (GET)', () => {
        it('should return user transactions', async () => {
            return supertest(app.getHttpServer())
                .get('/api/transactions/my')
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
            return supertest(app.getHttpServer())
                .get(`/api/transactions/${transactionId}`)
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.transactionId).toBe('TX12345');
                });
        });

        it('should return 404/Null if not found or not owner', async () => {
            // Register a temporary user to test 404
            const tempUserRes = await supertest(app.getHttpServer())
                .post('/api/auth/register')
                .send({
                    name: 'Temp User',
                    email: `temp-${Date.now()}@test.com`,
                    password: 'password123',
                    phone: `+911${Date.now().toString().slice(-9)}`,
                    gender: 'male',
                    dateOfBirth: '1990-01-01'
                });
            const tempToken = tempUserRes.body.data.accessToken;

            return supertest(app.getHttpServer())
                .get(`/api/transactions/${transactionId}`)
                .set('Authorization', `Bearer ${tempToken}`)
                .expect(404);
        });
    });

    describe('/admin/transactions (GET)', () => {
        it('should return all transactions for admin', async () => {
            return supertest(app.getHttpServer())
                .get('/api/admin/transactions')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.data)).toBe(true);
                    expect(res.body.data.length).toBeGreaterThan(0);
                });
        });

        it('should fail for customer', async () => {
            return supertest(app.getHttpServer())
                .get('/api/admin/transactions')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(403);
        });
    });

    describe('/admin/transactions/:id (GET)', () => {
        it('should return transaction by id for admin', async () => {
            return supertest(app.getHttpServer())
                .get(`/api/admin/transactions/${transactionId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.transactionId).toBe('TX12345');
                });
        });
    });

    describe('/admin/transactions/export (GET)', () => {
        it('should export transactions as CSV', async () => {
            return supertest(app.getHttpServer())
                .get('/api/admin/transactions/export')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect('Content-Type', /text\/csv/)
                .expect('Content-Disposition', /attachment; filename=transactions.csv/)
                .expect((res) => {
                    expect(res.text).toContain('Date,Transaction ID,User,Type,Amount,Status,Method,Description');
                    expect(res.text).toContain('TX12345');
                });
        });
    });
});
