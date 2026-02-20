import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

describe('Reviews Module (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let configService: ConfigService;
    let customerToken: string;
    let adminToken: string;
    let tourId: string;
    let bookingId: string;
    let userId: string;

    const mockCustomer = {
        _id: '65e9f9f9f9f9f9f9f9f9f901',
        email: 'reviewer@example.com',
        role: 'customer',
        name: 'Reviewer',
    };

    const mockAdmin = {
        _id: '65e9f9f9f9f9f9f9f9f9f902',
        email: 'admin@example.com',
        role: 'admin',
        name: 'Admin',
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

        const jwtSecret = configService.get<string>('JWT_SECRET') || 'your_secret';
        customerToken = jwt.sign({ sub: mockCustomer._id, email: mockCustomer.email, role: 'customer' }, jwtSecret);
        adminToken = jwt.sign({ sub: mockAdmin._id, email: mockAdmin.email, role: 'admin' }, jwtSecret);
        userId = mockCustomer._id;

        // Seed Users
        await connection.collection('users').deleteMany({});
        await connection.collection('users').insertMany([
            { ...mockCustomer, _id: new Types.ObjectId(mockCustomer._id) },
            { ...mockAdmin, _id: new Types.ObjectId(mockAdmin._id) }
        ]);

        // Seed Tour
        await connection.collection('tours').deleteMany({});
        const tour = await connection.collection('tours').insertOne({
            title: 'Reviewable Tour',
            slug: 'reviewable-tour',
            price: 100,
            rating: 0,
            reviewsCount: 0,
        });
        tourId = tour.insertedId.toString();

        // Seed TourDate (Required by Booking)
        await connection.collection('tourdates').deleteMany({});
        const tourDate = await connection.collection('tourdates').insertOne({
            tour: new Types.ObjectId(tourId),
            startDate: new Date(),
            endDate: new Date(),
            priceOverride: 100,
            availableSeats: 10
        });
        const tourDateId = tourDate.insertedId;

        // Seed Booking (Completed)
        await connection.collection('bookings').deleteMany({});
        const booking = await connection.collection('bookings').insertOne({
            bookingNumber: 'BK-E2E-001',
            user: new Types.ObjectId(mockCustomer._id),
            tour: new Types.ObjectId(tourId),
            tourDate: tourDateId,
            status: 'completed',
            totalAmount: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        bookingId = booking.insertedId.toString();

        // Clear Reviews and Indexes
        await connection.collection('reviews').deleteMany({});
        try { await connection.collection('reviews').dropIndexes(); } catch (e) { console.log('Drop indexes error:', e.message); }
        try { await connection.collection('reviews').dropIndex('user_1_tour_1'); } catch (e) { /* ignore if not exists */ }
    });

    afterAll(async () => {
        await connection.collection('reviews').deleteMany({});
        await connection.collection('bookings').deleteMany({});
        await connection.collection('tours').deleteMany({});
        await connection.collection('users').deleteMany({});
        await app.close();
    });

    describe('Customer Review Flow', () => {
        it('should create a review for completed booking', async () => {
            return request(app.getHttpServer())
                .post('/reviews')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    bookingId,
                    rating: 5,
                    comment: 'Amazing experience!',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.data.rating).toBe(5);
                    expect(res.body.data.status).toBe('pending');
                });
        });

        it('should NOT allow duplicate reviews', async () => {
            return request(app.getHttpServer())
                .post('/reviews')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    bookingId,
                    rating: 4,
                    comment: 'Duplicate!',
                })
                .expect(409);
        });

        it('should return my reviews', async () => {
            return request(app.getHttpServer())
                .get('/users/my-reviews')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(200)
                .expect((res) => {
                    console.log('GET /users/my-reviews Body:', JSON.stringify(res.body, null, 2));
                    const data = res.body.data.items ? res.body.data.items : res.body.data;
                    expect(data).toBeDefined();
                    expect(Array.isArray(data)).toBeTruthy();
                    expect(data.length).toBe(1);
                    expect(data[0].comment).toBe('Amazing experience!');
                });
        });

        it('should NOT list pending reviews publicly', async () => {
            return request(app.getHttpServer())
                .get(`/tours/${tourId}/reviews`)
                .expect(200)
                .expect((res) => {
                    console.log('GET /tours/:id/reviews (Pending) Body:', JSON.stringify(res.body, null, 2));
                    const data = res.body.data.items ? res.body.data.items : res.body.data;
                    expect(data).toBeDefined();
                    expect(data.length).toBe(0);
                });
        });
    });

    describe('Admin Moderation Flow', () => {
        let reviewId: string;

        it('should list all reviews for admin', async () => {
            return request(app.getHttpServer())
                .get('/admin/reviews')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.length).toBeGreaterThan(0);
                    reviewId = res.body.data[0]._id;
                    expect(res.body.data[0].status).toBe('pending');
                });
        });

        it('should approve the review', async () => {
            return request(app.getHttpServer())
                .patch(`/admin/reviews/${reviewId}/approve`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.status).toBe('approved');
                });
        });

        it('should list approved review publicly', async () => {
            return request(app.getHttpServer())
                .get(`/tours/${tourId}/reviews`)
                .expect(200)
                .expect((res) => {
                    const data = res.body.data.items ? res.body.data.items : res.body.data;
                    expect(data.length).toBe(1);
                    expect(data[0].comment).toBe('Amazing experience!');
                });
        });

        it('should update tour rating stats', async () => {
            const tour = await connection.collection('tours').findOne({ _id: new Types.ObjectId(tourId) });
            expect(tour!.averageRating).toBe(5);
            expect(tour!.reviewCount).toBe(1);
        });
    });

    describe('Rejection Flow', () => {
        // Create another review to reject
        let rejectBookingId: string;
        let rejectReviewId: string;

        beforeAll(async () => {
            // We need a tourDateId. We can reuse the one from beforeAll or create new one.
            // Since we don't have access to tourDateId scope easily unless we move it up, let's fetch one.
            const tourDate = await connection.collection('tourdates').findOne({ tour: new Types.ObjectId(tourId) });

            const b = await connection.collection('bookings').insertOne({
                bookingNumber: 'BK-E2E-002',
                user: new Types.ObjectId(mockCustomer._id),
                tour: new Types.ObjectId(tourId),
                tourDate: tourDate!._id,
                status: 'completed',
                totalAmount: 200,
                createdAt: new Date(),
            });
            rejectBookingId = b.insertedId.toString();

            // Manual insert review for speed or use API (API better for flow)
            // But create API blocks duplicate. 
            // Oh, create API checks bookingId uniqueness.
            // So I need a NEW booking. Correct.
        });

        it('should create another review', async () => {
            return request(app.getHttpServer())
                .post('/reviews')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    bookingId: rejectBookingId,
                    rating: 1,
                    comment: 'Bad trip',
                })
                .expect(201)
                .expect((res) => {
                    rejectReviewId = res.body.data._id;
                });
        });

        it('should reject the review', async () => {
            return request(app.getHttpServer())
                .patch(`/admin/reviews/${rejectReviewId}/reject`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ reason: 'Inappropriate language' })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.status).toBe('rejected');
                    expect(res.body.data.adminNote).toBe('Inappropriate language');
                });
        });

        it('should NOT list rejected review publicly', async () => {
            return request(app.getHttpServer())
                .get(`/tours/${tourId}/reviews`)
                .expect(200)
                .expect((res) => {
                    // Still only the first one
                    const data = res.body.data.items ? res.body.data.items : res.body.data;
                    expect(data.length).toBe(1);
                    expect(data[0].rating).toBe(5);
                });
        });
    });
});
