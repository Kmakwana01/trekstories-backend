import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { clearTestData } from './helpers/cleanup';
import { getTestConnection } from './helpers/test-db';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let customerToken: string;
  const testEmail = `login-test-${Date.now()}@test.com`;

  let context: E2EContext;

  beforeAll(async () => {
    context = await setupE2E();
    app = context.app;
    customerToken = context.customerToken;
  });

  afterAll(async () => {
    await teardownE2E(context);
  });

  it('/auth/register (POST) - Valid Registration', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'E2E Tester',
        email: testEmail,
        phone: `+919${Date.now().toString().slice(-9)}`,
        password: 'password123',
        gender: 'male',
        dateOfBirth: '1990-01-01T00:00:00.000Z',
      })
      .expect(201);

    expect(response.body.message).toContain('Registration successful');
    expect(response.body.data).toHaveProperty('accessToken');
  });

  let accessToken: string;
  let refreshToken: string;

  it('/auth/login (POST) - Success After Registration', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        identifier: testEmail,
        password: 'password123',
      })
      .expect(201);

    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
    accessToken = response.body.data.accessToken;
    refreshToken = response.body.data.refreshToken;
  });

  it('/auth/refresh (POST) - Success Refresh', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(201);

    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
    accessToken = response.body.data.accessToken;
    refreshToken = response.body.data.refreshToken;
  });

  it('/auth/logout (POST) - Success Logout', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
  });

  it('/api/auth/refresh (POST) - Fail After Logout', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken })
      .expect(403);
  });

  it('/auth/register (POST) - Invalid Data', () => {
    return request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'bad-email' })
      .expect(400);
  });

  it('/auth/me (GET) - Success with Token', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${customerToken}`)
      .expect(200);

    expect(res.body.data.email).toBeDefined();
  });
});
