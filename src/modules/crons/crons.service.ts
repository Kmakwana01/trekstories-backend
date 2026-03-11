import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TourDatesService } from '../tour-dates/tour-dates.service';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReportsService } from '../admin/services/reports.service';
import { DateUtil } from '../../utils/date.util';

@Injectable()
export class CronsService {
  private readonly logger = new Logger(CronsService.name);

  constructor(
    private readonly tourDatesService: TourDatesService,
    private readonly bookingsService: BookingsService,
    private readonly notificationsService: NotificationsService,
    private readonly reportsService: ReportsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyStatuses() {
    this.logger.log('Running daily tour date status update...');
    try {
      const result = await this.tourDatesService.autoUpdateStatuses();
      this.logger.log(`Tour date update result: ${result}`);
    } catch (err) {
      this.logger.error('Failed to update tour date statuses', err);
    }
  }

  // @Cron('0 9 * * *') // Every day at 9:00 AM
  // async handleTripReminders() {
  //     this.logger.log('Sending trip reminders for next 24 hours...');
  //     try
  //     {
  //         const tomorrowStart = DateUtil.nowIST().add(1, 'day').startOf('day').utc().toDate();
  //         const tomorrowEnd = DateUtil.nowIST().add(1, 'day').endOf('day').utc().toDate();

  //         const upcomingBookings = await this.bookingsService.getUpcomingDepartures(tomorrowStart, tomorrowEnd);

  //         for (const booking of upcomingBookings)
  //         {
  //             if (!booking.user || !(booking.user as any).email) continue;
  //             const email = (booking.user as any).email;
  //             const name = (booking.user as any).name || 'Traveler';
  //             const tourName = (booking.tourDate as any)?.tour?.title || 'your trip';

  //             await this.notificationsService.sendEmail(
  //                 email,
  //                 'Your Trip is Tomorrow!',
  //                 'trip-reminder',
  //                 { name, tourName, bookingNumber: booking.bookingNumber }
  //             );

  //             await this.notificationsService.createNotification(
  //                 (booking.user as any)._id.toString(),
  //                 'trip_reminder',
  //                 'Your Trip is Tomorrow!',
  //                 `Get ready! Your trip ${tourName} departs tomorrow. Check your booking details.`,
  //                 { bookingId: (booking as any)._id }
  //             );
  //         }
  //         this.logger.log(`Sent trip reminders for ${upcomingBookings.length} bookings.`);
  //     } catch (err)
  //     {
  //         this.logger.error('Failed to send trip reminders', err);
  //     }
  // }

  // @Cron('0 9 * * 1') // Every Monday at 9:00 AM
  // async generateWeeklyFinanceSummary() {
  //     this.logger.log('Generating weekly finance summary...');
  //     try
  //     {
  //         const lastWeekStart = DateUtil.nowIST().subtract(7, 'day').startOf('day').utc().toDate();
  //         const lastWeekEnd = DateUtil.nowIST().subtract(1, 'day').endOf('day').utc().toDate();

  //         const csv = await this.reportsService.generateRevenueCSV(lastWeekStart, lastWeekEnd);
  //         this.logger.log(`Weekly finance summary generated. Length: ${csv.length}`);
  //     } catch (err)
  //     {
  //         this.logger.error('Failed to generate weekly finance summary', err);
  //     }
  // }
}
