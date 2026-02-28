import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/roles.enum';
import { ReportsService } from '../services/reports.service';
import type { Response } from 'express';
import { DateUtil } from '../../../utils/date.util';

@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminReportsController {
    constructor(private reportsService: ReportsService) { }

    @Get('revenue/csv')
    async getRevenueCSV(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Res() res: Response,
    ) {
        const start = startDate ? DateUtil.startOfDayIST(startDate) : DateUtil.nowIST().subtract(30, 'day').startOf('day').utc().toDate();
        const end = endDate ? DateUtil.endOfDayIST(endDate) : DateUtil.nowUTC();

        const csv = await this.reportsService.generateRevenueCSV(start, end);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.csv');
        res.send(csv);
    }

    @Get('revenue/pdf')
    async getRevenuePDF(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Res() res: Response,
    ) {
        const start = startDate ? DateUtil.startOfDayIST(startDate) : DateUtil.nowIST().subtract(30, 'day').startOf('day').utc().toDate();
        const end = endDate ? DateUtil.endOfDayIST(endDate) : DateUtil.nowUTC();

        const buffer = await this.reportsService.generateRevenuePDF(start, end);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.pdf');
        res.send(buffer);
    }

    @Get('bookings/csv')
    async getBookingCSV(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Res() res: Response,
    ) {
        const start = startDate ? DateUtil.startOfDayIST(startDate) : DateUtil.nowIST().subtract(30, 'day').startOf('day').utc().toDate();
        const end = endDate ? DateUtil.endOfDayIST(endDate) : DateUtil.nowUTC();

        const csv = await this.reportsService.generateBookingCSV(start, end);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=booking-report.csv');
        res.send(csv);
    }
}
