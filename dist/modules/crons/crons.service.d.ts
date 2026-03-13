import { TourDatesService } from '../tour-dates/tour-dates.service';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReportsService } from '../admin/services/reports.service';
export declare class CronsService {
    private readonly tourDatesService;
    private readonly bookingsService;
    private readonly notificationsService;
    private readonly reportsService;
    private readonly logger;
    constructor(tourDatesService: TourDatesService, bookingsService: BookingsService, notificationsService: NotificationsService, reportsService: ReportsService);
    handleDailyStatuses(): Promise<void>;
}
