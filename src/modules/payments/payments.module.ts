import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from '../../database/schemas/payment.schema';
import { BookingsModule } from '../bookings/bookings.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { AdminPaymentsController } from './admin-payments/admin-payments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    BookingsModule,
    TransactionsModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController, AdminPaymentsController],
  exports: [PaymentsService],
})

export class PaymentsModule { }
