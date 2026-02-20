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

describe('Blogs Module (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let configService: ConfigService;
    let adminToken: string;
    let blogId: string;
    let blogSlug: string;

    const mockAdmin = {
        _id: '65e9f9f9f9f9f9f9f9f9f902',
        email: 'admin@example.com',
        role: 'admin',
    };

    const newBlog = {
        title: 'E2E Test Blog',
        content: '<h1>Hello World</h1><p>This is a test blog.</p>',
        excerpt: 'Test blog excerpt.',
        category: 'Technology',
        tags: ['nestjs', 'e2e'],
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

        // Create token
        const jwtSecret = configService.get<string>('JWT_SECRET') || 'your_secret';
        adminToken = jwt.sign({ sub: mockAdmin._id, email: mockAdmin.email, role: 'admin' }, jwtSecret);

        // Seed admin user
        await connection.collection('users').deleteMany({});
        await connection.collection('users').insertOne({ ...mockAdmin, _id: new Types.ObjectId(mockAdmin._id) });

        // Clear blogs
        await connection.collection('blogs').deleteMany({});
    });

    afterAll(async () => {
        await connection.collection('blogs').deleteMany({});
        await connection.collection('users').deleteMany({});
        await app.close();
    });

    describe('Admin Flow', () => {
        it('should create a new blog draft', async () => {
            return request(app.getHttpServer())
                .post('/admin/blogs')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newBlog)
                .expect(201)
                .expect((res) => {
                    expect(res.body.data.title).toBe(newBlog.title);
                    expect(res.body.data.slug).toBe('e2e-test-blog');
                    expect(res.body.data.isPublished).toBe(false);
                    blogId = res.body.data._id;
                    blogSlug = res.body.data.slug;
                });
        });

        it('should get all blogs (including drafts)', async () => {
            return request(app.getHttpServer())
                .get('/admin/blogs')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.length).toBeGreaterThan(0);
                    expect(res.body.data[0]._id).toBe(blogId);
                });
        });

        it('should update the blog', async () => {
            return request(app.getHttpServer())
                .patch(`/admin/blogs/${blogId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ title: 'Updated E2E Blog' })
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.title).toBe('Updated E2E Blog');
                    expect(res.body.data.slug).toBe('updated-e2e-blog');
                    blogSlug = res.body.data.slug;
                });
        });
    });

    describe('Public Flow (Draft)', () => {
        it('should NOT return draft blog by slug', async () => {
            return request(app.getHttpServer())
                .get(`/blogs/${blogSlug}`)
                .expect(404);
        });

        it('should NOT list draft blogs', async () => {
            return request(app.getHttpServer())
                .get('/blogs')
                .expect(200)
                .expect((res) => {
                    const found = res.body.data.find(b => b._id === blogId);
                    expect(found).toBeUndefined();
                });
        });
    });

    describe('Publishing Flow', () => {
        it('should publish the blog', async () => {
            return request(app.getHttpServer())
                .patch(`/admin/blogs/${blogId}/publish`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.isPublished).toBe(true);
                    expect(res.body.data.publishedAt).toBeDefined();
                });
        });
    });

    describe('Public Flow (Published)', () => {
        it('should return published blog by slug', async () => {
            return request(app.getHttpServer())
                .get(`/blogs/${blogSlug}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data._id).toBe(blogId);
                    // Check initial view count (might be 0 or 1 depending on when increment happens)
                });
        });

        it('should increment view count', async () => {
            // Request again
            await request(app.getHttpServer()).get(`/blogs/${blogSlug}`).expect(200);

            // Check via admin (to see raw data)
            return request(app.getHttpServer())
                .get(`/admin/blogs/${blogId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.viewCount).toBeGreaterThanOrEqual(2);
                });
        });

        it('should list published blogs', async () => {
            return request(app.getHttpServer())
                .get('/blogs')
                .expect(200)
                .expect((res) => {
                    const found = res.body.data.find(b => b._id === blogId);
                    expect(found).toBeDefined();
                });
        });

        it('should filter by category', async () => {
            return request(app.getHttpServer())
                .get('/blogs?category=Technology')
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.length).toBeGreaterThan(0);
                });
        });

        it('should return empty list for non-matching filter', async () => {
            return request(app.getHttpServer())
                .get('/blogs?category=Cooking')
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.length).toBe(0);
                });
        });
    });

    describe('Unpublishing Flow', () => {
        it('should unpublish the blog', async () => {
            return request(app.getHttpServer())
                .patch(`/admin/blogs/${blogId}/unpublish`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.isPublished).toBe(false);
                });
        });

        it('should NOT be visible to public after unpublish', async () => {
            return request(app.getHttpServer())
                .get(`/blogs/${blogSlug}`)
                .expect(404);
        });
    });
});
