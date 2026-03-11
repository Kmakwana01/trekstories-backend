import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';

describe('HomeController (e2e)', () => {
  let app: INestApplication;
  let context: E2EContext;
  let userToken: string;

  beforeAll(async () => {
    context = await setupE2E();
    app = context.app;
    userToken = context.customerToken;
  });

  afterAll(async () => {
    await teardownE2E(context);
  });

  describe('GET /home/featured-tours', () => {
    it('should return featured tours', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/home/featured-tours')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /home/upcoming-departures', () => {
    it('should return upcoming departures', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/home/upcoming-departures')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /home/offers', () => {
    it('should return active offers', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/home/offers')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /home/blogs', () => {
    it('should return latest blogs', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/home/blogs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /home/tours-by-state', () => {
    it('should return tours grouped by state', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/home/tours-by-state')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return paginated tours for a specific state', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/home/tours-by-state/Himachal?page=1&limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tours).toBeDefined();
      expect(response.body.data.total).toBeDefined();
    });
  });

  describe('GET /home/recently-viewed', () => {
    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer())
        .get('/api/home/recently-viewed')
        .expect(401);
    });

    it('should return recently viewed tours if authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/home/recently-viewed')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
