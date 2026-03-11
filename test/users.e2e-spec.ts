import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { setupE2E, teardownE2E, E2EContext } from './helpers/e2e-bootstrap';
import { E2E_CUSTOMER } from './helpers/test-users';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  const testEmail = E2E_CUSTOMER.email;

  let context: E2EContext;

  beforeAll(async () => {
    context = await setupE2E();
    app = context.app;
    accessToken = context.customerToken;
  });

  afterAll(async () => {
    await teardownE2E(context);
  });

  it('/users/profile (GET) - Get Profile', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.data.email).toBe(testEmail);
  });

  it('/api/users/profile (PATCH) - Update Profile', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/users/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated Name',
        country: 'India',
        gender: 'female',
        dateOfBirth: '1995-05-05',
      })
      .expect(200);

    expect(response.body.data.name).toBe('Updated Name');
    expect(response.body.data.gender).toBe('female');
    expect(response.body.data.dateOfBirth).toBeDefined();
  });

  it('/api/users/travelers (POST) - Add Traveler', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users/travelers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        fullName: 'Saved Traveler',
        age: 25,
        gender: 'female',
        idNumber: 'ID12345',
      })
      .expect(201);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data[0].fullName).toBe('Saved Traveler');
  });

  it('/users/travelers (GET) - Get Travelers', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/travelers')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.data).toHaveLength(1);
  });
});
