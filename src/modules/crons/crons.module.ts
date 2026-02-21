import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { TourDatesModule } from '../tour-dates/tour-dates.module';
import { BookingsModule } from '../bookings/bookings.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    TourDatesModule,
    BookingsModule,
    NotificationsModule,
    AdminModule
  ],
  providers: [CronsService]
})
export class CronsModule { }
