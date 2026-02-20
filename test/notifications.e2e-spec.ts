import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

describe('NotificationsController (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let userToken: string;
    let adminToken: string;
    let notificationId: string;

    const USER_EMAIL = 'notif_e2e_user@example.com';
    const USER_PASS = 'Password123!';
    const ADMIN_EMAIL = 'notif_e2e_admin@example.com';
    const ADMIN_PASS = 'Password123!';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        connection = moduleFixture.get<Connection>(getConnectionToken());

        // 1. Register and login regular user
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({ name: 'Notif User', email: USER_EMAIL, phone: '9898989801', password: USER_PASS });

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ identifier: USER_EMAIL, password: USER_PASS });
        userToken = loginRes.body.accessToken;

        // 2. Register and promote admin user
        await request(app.getHttpServer())
            .post('/auth/register')
            .send({ name: 'Notif Admin', email: ADMIN_EMAIL, phone: '9898989802', password: ADMIN_PASS });

        await connection.collection('users').updateOne(
            { email: ADMIN_EMAIL },
            { $set: { role: 'admin', isVerified: true, isBlocked: false } }
        );

        const adminLoginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ identifier: ADMIN_EMAIL, password: ADMIN_PASS });
        adminToken = adminLoginRes.body.accessToken;
    });

    afterAll(async () => {
        await connection.collection('users').deleteMany({ email: { $in: [USER_EMAIL, ADMIN_EMAIL] } });
        await connection.collection('notifications').deleteMany({});
        await app.close();
    });

    it('Admin should send bulk email', async () => {
        return request(app.getHttpServer())
            .post('/admin/notifications/email')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ emails: [USER_EMAIL], subject: 'Test Email', message: 'Hello from E2E test' })
            .expect(201)
            .expect(res => { expect(res.body.message).toContain('Queued emails'); });
    });

    it('Admin should send bulk WhatsApp', async () => {
        return request(app.getHttpServer())
            .post('/admin/notifications/whatsapp')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ phones: ['9898989801'], message: 'Hello from WhatsApp E2E' })
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
            .post('/admin/tours')
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
            .post('/admin/tour-dates')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(dateData);

        const tourDateId = dateRes.body?.data?._id || dateRes.body?._id;

        const bookingRes = await request(app.getHttpServer())
            .post('/bookings/create')
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
            .get('/notifications')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        expect(notifRes.body.items.length).toBeGreaterThan(0);
        notificationId = notifRes.body.items[0]._id;
        expect(notifRes.body.items[0].title).toBe('Booking Created');
    });

    it('User should mark notification as read', async () => {
        expect(notificationId).toBeDefined();
        return request(app.getHttpServer())
            .patch(`/notifications/${notificationId}/read`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
            .expect(res => { expect(res.body.isRead).toBe(true); });
    });

    it('User should mark all notifications as read', async () => {
        return request(app.getHttpServer())
            .patch('/notifications/read-all')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
            .expect(res => { expect(res.body.success).toBe(true); });
    });
});
