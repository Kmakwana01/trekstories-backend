import { Module } from '@nestjs/common';
import { AdminLogService } from './services/admin-log.service';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AdminCrmService } from './services/admin-crm.service';
import { ReportsService } from './services/reports.service';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminReportsController } from './controllers/admin-reports.controller';
import { AdminLogsController } from './controllers/admin-logs.controller';

@Module({
    providers: [AdminLogService, AdminDashboardService, AdminCrmService, ReportsService],
    controllers: [AdminDashboardController, AdminUsersController, AdminReportsController, AdminLogsController],
    exports: [AdminLogService],
})
export class AdminModule { }
