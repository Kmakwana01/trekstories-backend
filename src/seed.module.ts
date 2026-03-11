import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import configuration from './config/configuration';
import { User, UserSchema } from './database/schemas/user.schema';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), '..', '.env'),
      ],
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class SeedModule {}
