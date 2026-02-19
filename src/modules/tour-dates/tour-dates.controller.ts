import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TourDatesService } from './tour-dates.service';
import { CreateTourDateDto, UpdateTourDateDto } from './dto/create-tour-date.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('tour-dates')
export class TourDatesController {
    constructor(private readonly tourDatesService: TourDatesService) { }

    @Get(':tourId')
    async getUpcomingDates(@Param('tourId') tourId: string) {
        return this.tourDatesService.getUpcomingDates(tourId);
    }
}

@Controller('admin/tour-dates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminTourDatesController {
    constructor(private readonly tourDatesService: TourDatesService) { }

    @Get(':tourId')
    async getTourDates(@Param('tourId') tourId: string) {
        return this.tourDatesService.adminGetTourDates(tourId);
    }

    @Post()
    async createTourDate(@Body() createTourDateDto: CreateTourDateDto) {
        return this.tourDatesService.adminCreateTourDate(createTourDateDto);
    }

    @Patch(':id')
    async updateTourDate(@Param('id') id: string, @Body() updateTourDateDto: UpdateTourDateDto) {
        return this.tourDatesService.adminUpdateTourDate(id, updateTourDateDto);
    }

    @Delete(':id')
    async deleteTourDate(@Param('id') id: string) {
        await this.tourDatesService.adminDeleteTourDate(id);
        return { message: 'Tour date deleted successfully' };
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.tourDatesService.updateStatus(id, status);
    }

    @Post('auto-update-status')
    async triggerAutoUpdate() {
        return this.tourDatesService.autoUpdateStatuses();
    }
}
