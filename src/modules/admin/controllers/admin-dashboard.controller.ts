import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/roles.enum';
import { AdminDashboardService } from '../services/admin-dashboard.service';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminDashboardController {
  constructor(private dashboardService: AdminDashboardService) {}

  @Get('summary')
  async getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('revenue-chart')
  async getRevenueChart(
    @Query('period') period: 'daily' | 'monthly' | 'yearly',
  ) {
    return this.dashboardService.getRevenueChart(period || 'daily');
  }

  @Get('top-tours')
  async getTopTours(@Query('limit') limit: string) {
    return this.dashboardService.getTopTours(parseInt(limit) || 5);
  }

  @Get('recent-bookings')
  async getRecentBookings(@Query('limit') limit: string) {
    return this.dashboardService.getRecentBookings(parseInt(limit) || 5);
  }
}
