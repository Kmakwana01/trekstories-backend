import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TourDatesService } from './tour-dates.service';
import { CreateTourDateDto, UpdateTourDateDto } from './dto/create-tour-date.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { AdminLogService } from '../admin/services/admin-log.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('tour-dates')
export class TourDatesController {
    constructor(private readonly tourDatesService: TourDatesService) { }

    @Get(':tourId')
    async getUpcomingDates(@Param('tourId') tourId: string) {
        return this.tourDatesService.getUpcomingDates(tourId);
    }

    @Get(':tourId/with-seats')
    async getTourDatesWithSeats(@Param('tourId') tourId: string) {
        return this.tourDatesService.getTourDatesWithSeats(tourId);
    }
}

@Controller('admin/tour-dates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminTourDatesController {
    constructor(
        private readonly tourDatesService: TourDatesService,
        private readonly adminLogService: AdminLogService,
    ) { }

    @Get(':tourId')
    async getTourDates(@Param('tourId') tourId: string) {
        return this.tourDatesService.adminGetTourDates(tourId);
    }

    @Post()
    async createTourDate(
        @Body() createTourDateDto: CreateTourDateDto,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const tourDate = await this.tourDatesService.adminCreateTourDate(createTourDateDto);
        await this.adminLogService.logAction(adminId, 'CREATE_TOUR_DATE', 'TourDates', (tourDate as any)._id?.toString(), { tour: createTourDateDto.tour }, req.ip, req.headers['user-agent']);
        return tourDate;
    }

    @Patch(':id')
    async updateTourDate(
        @Param('id') id: string,
        @Body() updateTourDateDto: UpdateTourDateDto,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const tourDate = await this.tourDatesService.adminUpdateTourDate(id, updateTourDateDto);
        await this.adminLogService.logAction(adminId, 'UPDATE_TOUR_DATE', 'TourDates', id, { fields: Object.keys(updateTourDateDto) }, req.ip, req.headers['user-agent']);
        return tourDate;
    }

    @Delete(':id')
    async deleteTourDate(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        await this.tourDatesService.adminDeleteTourDate(id);
        await this.adminLogService.logAction(adminId, 'DELETE_TOUR_DATE', 'TourDates', id, {}, req.ip, req.headers['user-agent']);
        return { message: 'Tour date deleted successfully' };
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const tourDate = await this.tourDatesService.updateStatus(id, status);
        await this.adminLogService.logAction(adminId, 'UPDATE_TOUR_DATE_STATUS', 'TourDates', id, { status }, req.ip, req.headers['user-agent']);
        return tourDate;
    }

    @Post('auto-update-status')
    async triggerAutoUpdate() {
        return this.tourDatesService.autoUpdateStatuses();
    }
}
