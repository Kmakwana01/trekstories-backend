import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminLogService } from './services/admin-log.service';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AdminCrmService } from './services/admin-crm.service';
import { ReportsService } from './services/reports.service';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminReportsController } from './controllers/admin-reports.controller';
import { AdminLogsController } from './controllers/admin-logs.controller';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { Tour, TourSchema } from '../../database/schemas/tour.schema';
import { Review, ReviewSchema } from '../../database/schemas/review.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Booking.name, schema: BookingSchema },
            { name: User.name, schema: UserSchema },
            { name: Tour.name, schema: TourSchema },
            { name: Review.name, schema: ReviewSchema },
        ]),
    ],
    providers: [AdminLogService, AdminDashboardService, AdminCrmService, ReportsService],
    controllers: [AdminDashboardController, AdminUsersController, AdminReportsController, AdminLogsController],
    exports: [AdminLogService, ReportsService],
})
export class AdminModule { }
