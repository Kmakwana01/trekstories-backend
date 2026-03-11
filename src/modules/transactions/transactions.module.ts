import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AdminTransactionsController } from './admin-transactions.controller';
import { Transaction, TransactionSchema } from '../../database/schemas/transaction.schema';
import { BookingsModule } from '../bookings/bookings.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    forwardRef(() => BookingsModule),
    NotificationsModule,
  ],
  providers: [TransactionsService],
  controllers: [TransactionsController, AdminTransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule { }
