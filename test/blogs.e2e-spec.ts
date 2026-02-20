import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Connection } from 'mongoose';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';

describe('Blogs Module (e2e)', () => {
    let app: INestApplication;
    let connection: Connection;
    let adminToken: string;
    let blogId: string;
    let blogSlug: string;

    let context: E2EContext;

    const newBlog = {
        title: 'E2E Test Blog',
        content: '<h1>Hello World</h1><p>This is a test blog.</p>',
        excerpt: 'Test blog excerpt.',
        category: 'Technology',
        tags: ['nestjs', 'e2e'],
    };

    beforeAll(async () => {
        context = await setupE2E();
        app = context.app;
        connection = context.connection;
        adminToken = context.adminToken;
    });

    afterAll(async () => {
        await teardownE2E(context);
    });

    describe('Admin Flow', () => {
        it('should create a new blog draft', async () => {
            return request(app.getHttpServer())
                .post('/api/admin/blogs')
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
                .get('/api/admin/blogs')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.length).toBeGreaterThan(0);
                    expect(res.body.data[0]._id).toBe(blogId);
                });
        });

        it('should update the blog', async () => {
            return request(app.getHttpServer())
                .patch(`/api/admin/blogs/${blogId}`)
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
                .get(`/api/blogs/${blogSlug}`)
                .expect(404);
        });

        it('should NOT list draft blogs', async () => {
            return request(app.getHttpServer())
                .get('/api/blogs')
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
                .patch(`/api/admin/blogs/${blogId}/publish`)
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
                .get(`/api/blogs/${blogSlug}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data._id).toBe(blogId);
                    // Check initial view count (might be 0 or 1 depending on when increment happens)
                });
        });

        it('should increment view count', async () => {
            // Request again
            await request(app.getHttpServer()).get(`/api/blogs/${blogSlug}`).expect(200);

            // Check via admin (to see raw data)
            return request(app.getHttpServer())
                .get(`/api/admin/blogs/${blogId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.viewCount).toBeGreaterThanOrEqual(2);
                });
        });

        it('should list published blogs', async () => {
            return request(app.getHttpServer())
                .get('/api/blogs')
                .expect(200)
                .expect((res) => {
                    const found = res.body.data.find(b => b._id === blogId);
                    expect(found).toBeDefined();
                });
        });

        it('should filter by category', async () => {
            return request(app.getHttpServer())
                .get('/api/blogs?category=Technology')
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.length).toBeGreaterThan(0);
                });
        });

        it('should return empty list for non-matching filter', async () => {
            return request(app.getHttpServer())
                .get('/api/blogs?category=Cooking')
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.length).toBe(0);
                });
        });
    });

    describe('Unpublishing Flow', () => {
        it('should unpublish the blog', async () => {
            return request(app.getHttpServer())
                .patch(`/api/admin/blogs/${blogId}/unpublish`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data.isPublished).toBe(false);
                });
        });

        it('should NOT be visible to public after unpublish', async () => {
            return request(app.getHttpServer())
                .get(`/api/blogs/${blogSlug}`)
                .expect(404);
        });
    });
});
