import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let context: E2EContext;

  beforeAll(async () => {
    context = await setupE2E();
    app = context.app;
  });

  afterAll(async () => {
    await teardownE2E(context);
  });

  it('/ (GET) - Smoke Test', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
      });
  });
});
