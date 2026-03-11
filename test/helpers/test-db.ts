import { getConnectionToken } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';

/**
 * Helper to retrieve the database connection from a Nest application instance.
 */
export function getTestConnection(app: INestApplication): Connection {
  return app.get<Connection>(getConnectionToken());
}
