import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';

describe('Admin Module (e2e)', () => {
    let app: INestApplication;
    let context: E2EContext;
    let adminToken: string;
    let customerToken: string;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        adminToken = context.adminToken;
        customerToken = context.customerToken;
    });

    afterAll(async () => {
        await teardownE2E(context);
    });

    describe('RBAC Protection', () => {
        it('should deny access to customers for admin summary', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/dashboard/summary')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(403);
        });

        it('should allow access to admins for admin summary', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/dashboard/summary')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });

    describe('Admin Dashboard', () => {
        it('GET /api/admin/dashboard/summary', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/admin/dashboard/summary')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('totalBookings');
            expect(response.body.data).toHaveProperty('totalRevenue');
        });

        it('GET /api/admin/dashboard/revenue-chart', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/admin/dashboard/revenue-chart?period=daily')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('Admin CRM (Users)', () => {
        it('GET /api/admin/users', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('items');
        });
    });

    describe('Admin Reports', () => {
        it('GET /api/admin/reports/revenue/csv', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/reports/revenue/csv')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect('Content-Type', /text\/csv/);
        });

        it('GET /api/admin/reports/revenue/pdf', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/reports/revenue/pdf')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect('Content-Type', /application\/pdf/);
        });
    });

    describe('Admin Logs', () => {
        it('GET /api/admin/logs', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/admin/logs')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('items');
        });
    });
});
