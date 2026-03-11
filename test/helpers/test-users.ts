import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from '../../src/common/enums/roles.enum';

export const E2E_ADMIN = {
  email: 'admin@e2e.com',
  password: 'Password123!',
  phone: '+919999999999',
  name: 'Unified Admin',
};

export const E2E_CUSTOMER = {
  email: 'customer@e2e.com',
  password: 'Password123!',
  phone: '+918888888888',
  name: 'Unified Customer',
};

export async function getUnifiedTokens(app: INestApplication) {
  const userModel = app.get(getModelToken('User'));

  // Setup Admin
  const adminToken = await loginOrRegister(
    app,
    E2E_ADMIN,
    Role.ADMIN,
    userModel,
  );

  // Setup Customer
  const customerToken = await loginOrRegister(
    app,
    E2E_CUSTOMER,
    Role.CUSTOMER,
    userModel,
  );

  return { adminToken, customerToken };
}

async function loginOrRegister(
  app: INestApplication,
  creds: any,
  role: Role,
  userModel: any,
) {
  // 1. Try login
  let loginRes = await request(app.getHttpServer())
    .post(role === Role.ADMIN ? '/api/admin/auth/login' : '/api/auth/login')
    .send({ identifier: creds.email, password: creds.password });

  if (loginRes.status === 200 || loginRes.status === 201) {
    return loginRes.body?.data?.accessToken;
  }

  // 2. Register if login fails
  const regRes = await request(app.getHttpServer())
    .post('/api/auth/register')
    .send({
      name: creds.name,
      email: creds.email,
      phone: creds.phone,
      password: creds.password,
      gender: 'male',
      dateOfBirth: '1990-01-01',
    });

  if (regRes.status !== 201) {
    throw new Error(
      `Unified user registration failed for ${creds.email}: ${JSON.stringify(regRes.body)}`,
    );
  }

  // 3. Verify OTP and promote if admin
  const user = await userModel.findOne({ email: creds.email });
  if (!user)
    throw new Error(`User not found after registration: ${creds.email}`);

  await request(app.getHttpServer())
    .post('/api/auth/verify-otp')
    .send({ identifier: creds.email, otp: user.otp });

  if (role === Role.ADMIN) {
    user.role = Role.ADMIN;
    await user.save();
  }

  // 4. Final login
  loginRes = await request(app.getHttpServer())
    .post(role === Role.ADMIN ? '/api/admin/auth/login' : '/api/auth/login')
    .send({ identifier: creds.email, password: creds.password });

  return loginRes.body?.data?.accessToken;
}
