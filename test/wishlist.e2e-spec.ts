import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { Connection, Types } from 'mongoose';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';

describe('Wishlist (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let customerToken: string;
    let testTourId: string;

    let context: E2EContext;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        connection = context.connection;
        customerToken = context.customerToken;

        await clearTestData(connection);

        // Reset persistent user wishlist
        await connection.collection('users').updateOne(
            { email: 'customer@e2e.com' },
            { $set: { wishlist: [] } }
        );

        const tour = await connection.collection('tours').insertOne({
            title: 'Wishlist Tour',
            slug: 'wishlist-tour',
            basePrice: 1000,
            category: new Types.ObjectId('659c00000000000000000000'),
            location: 'Himalayas',
            duration: '3 Days',
            state: 'HP',
            country: 'India',
            isActive: true,
        });
        testTourId = tour.insertedId.toString();
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
