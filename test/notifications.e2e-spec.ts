import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';

describe('NotificationsController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let userToken: string;
    let adminToken: string;
    let notificationId: string;

    let context: E2EContext;

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        connection = context.connection;
        userToken = context.customerToken;
        adminToken = context.adminToken;
    });

    afterAll(async () => {
        await teardownE2E(context);
    });

    it('Admin should send bulk email', async () => {
        return request(app.getHttpServer())
            .post('/api/admin/notifications/email')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ emails: ['customer@e2e.com'], subject: 'Test Email', message: 'Hello from E2E test' })
            .expect(201)
            .expect(res => { expect(res.body.message).toContain('Queued emails'); });
    });

    it('Admin should send bulk WhatsApp', async () => {
        return request(app.getHttpServer())
            .post('/api/admin/notifications/whatsapp')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ phones: ['+918888888888'], message: 'Hello from WhatsApp E2E' })
            .expect(201)
            .expect(res => { expect(res.body.message).toContain('Queued WhatsApp messages'); });
    });

    it('Should create a notification for user (via booking)', async () => {
        // Seed an active tour and date via API
        const uniqueSuffix = Date.now().toString();
        const tourData = {
            title: `Test Notification Tour ${uniqueSuffix}`,
            description: 'Tour for E2E notifications',
            basePrice: 1000,
            isActive: true,
            location: 'Test City',
            state: 'Test State',
            country: 'Test Country',
            duration: '5 Days',
            category: '659c00000000000000000000',
            departureOptions: [
                {
                    fromCity: 'Test City',
                    type: 'AC',
                    totalDays: 5,
                    totalNights: 4,
                    priceAdjustment: 0
                }
            ]
        };

        const tourRes = await request(app.getHttpServer())
            .post('/api/admin/tours')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(tourData);

        const tourId = tourRes.body?.data?._id || tourRes.body?._id;

        const dateData = {
            tour: tourId,
            startDate: new Date(Date.now() + 86400000).toISOString(),
            endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
            totalSeats: 20
        };

        const dateRes = await request(app.getHttpServer())
            .post('/api/admin/tour-dates')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(dateData);

        const tourDateId = dateRes.body?.data?._id || dateRes.body?._id;

        const bookingRes = await request(app.getHttpServer())
            .post('/api/bookings/create')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                tourDateId,
                pickupOptionIndex: 0,
                travelers: [{ fullName: 'Test Traveler', age: 25, gender: 'male' }]
            });

        expect(bookingRes.status).toBe(201);

        // Brief wait for non-blocking notification to persist (though we made it blocking, fine to leave)
        await new Promise(r => setTimeout(r, 100));

        const notifRes = await request(app.getHttpServer())
            .get('/api/notifications')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        expect(notifRes.body.data.items.length).toBeGreaterThan(0);
        notificationId = notifRes.body.data.items[0]._id;
        expect(notifRes.body.data.items[0].title).toBe('Booking Created');
    });

    it('User should mark notification as read', async () => {
        expect(notificationId).toBeDefined();
        return request(app.getHttpServer())
            .patch(`/api/notifications/${notificationId}/read`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
            .expect(res => {
                const data = res.body.data || res.body;
                expect(data.isRead).toBeDefined();
            });
    });

    it('User should mark all notifications as read', async () => {
        return request(app.getHttpServer())
            .patch('/api/notifications/read-all')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
            .expect(res => { expect(res.body.success).toBe(true); });
    });
});
