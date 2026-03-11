import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { TransformInterceptor } from '../../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { getTestConnection } from './test-db';
import { Connection } from 'mongoose';
import { getUnifiedTokens } from './test-users';
import { clearTestData } from './cleanup';

export interface E2EContext {
  app: INestApplication;
  connection: Connection;
  adminToken: string;
  customerToken: string;
}

export async function setupE2E(): Promise<E2EContext> {
  // Ensure we always use the test database
  process.env.MONGO_URI = 'mongodb://localhost:27017/travel-test';

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Standard Production Configuration
  app.enableCors();
  app.setGlobalPrefix('api');
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

  const connection = getTestConnection(app);
  await clearTestData(connection);

  // Get Unified Tokens
  const { adminToken, customerToken } = await getUnifiedTokens(app);

  return {
    app,
    connection,
    adminToken,
    customerToken,
  };
}

export async function teardownE2E(context: E2EContext) {
  if (context.connection) {
    await clearTestData(context.connection);

    // Ensure persistent users are purged of metadata
    await context.connection
      .collection('users')
      .updateMany(
        { email: { $in: ['admin@e2e.com', 'customer@e2e.com'] } },
        { $set: { wishlist: [], savedTravelers: [] } },
      );
  }
  await context.app.close();
}
