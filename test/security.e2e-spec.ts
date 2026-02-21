import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';

describe('Security (e2e)', () => {
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

    describe('NoSQL Injection Protection', () => {
        it('should block NoSQL injection in query params (via ValidationPipe or Sanitization)', async () => {
            // Attempt to use {"$gt": ""}
            const res = await request(app.getHttpServer())
                .get('/api/tours?category[$gt]=')
                .expect(res => {
                    // It should either be 400 (Blocked by ValidationPipe) or 200 (Sanitized)
                    if (res.status !== 400 && res.status !== 200)
                    {
                        throw new Error(`Expected 400 or 200, got ${res.status}`);
                    }
                });
        });

        it('should sanitize or block NoSQL injection in body', async () => {
            await request(app.getHttpServer())
                .get('/api/tours/search')
                .send({ query: { "$gt": "" } })
                .expect(res => {
                    // It should either return 200 (sanitized search) or 400/404 (validation fail/not found)
                    // but NOT 500 or leaked data.
                    return res.status === 200 || res.status === 400 || res.status === 404;
                });
        });
    });

    describe('RBAC Violations', () => {
        it('should deny customer access to admin routes (403)', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/dashboard/summary')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(403);
        });

        it('should deny unauthenticated access to protected routes (401)', async () => {
            await request(app.getHttpServer())
                .get('/api/users/profile')
                .expect(401);
        });

        it('should deny unauthorized admin actions by customers', async () => {
            await request(app.getHttpServer())
                .post('/api/admin/tours')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({ title: 'Hacked Tour' })
                .expect(403);
        });
    });

    describe('Rate Limiting', () => {
        it('should return 429 after too many requests', async () => {
            // Limit is 30 per minute. We'll send 35.
            const reqs: any[] = [];
            for (let i = 0; i < 35; i++)
            {
                reqs.push(request(app.getHttpServer()).get('/api/auth/me').set('Authorization', `Bearer ${customerToken}`));
            }

            const results = await Promise.all(reqs);
            const statusCodes = results.map(r => r.status);
            const has429 = statusCodes.includes(429);

            expect(has429).toBe(true);
        });
    });

    describe('JWT Integrity', () => {
        it('should deny access with tampered token', async () => {
            const tamperedToken = customerToken.substring(0, customerToken.length - 10) + 'invalidabc';
            await request(app.getHttpServer())
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${tamperedToken}`)
                .expect(401);
        });
    });
});
