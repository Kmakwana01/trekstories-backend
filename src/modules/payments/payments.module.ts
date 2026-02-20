import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from '../../database/schemas/payment.schema';
import { BookingsModule } from '../bookings/bookings.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { AdminPaymentsController } from './admin-payments/admin-payments.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    BookingsModule,
    TransactionsModule,
    NotificationsModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController, AdminPaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule { }
