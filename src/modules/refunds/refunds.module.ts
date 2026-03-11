import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RefundsController } from './refunds.controller';
import { RefundsService } from './refunds.service';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import {
  Transaction,
  TransactionSchema,
} from '../../database/schemas/transaction.schema';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    NotificationsModule,
    AuthModule,
  ],
  controllers: [RefundsController],
  providers: [RefundsService],
})
export class RefundsModule {}
