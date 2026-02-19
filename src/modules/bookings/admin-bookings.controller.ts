import { Controller, Get, Post, Body, Param, UseGuards, Patch, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { BookingsService } from './bookings.service';

@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminBookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Get()
    async getAllBookings(@Query() filters: any) {
        return this.bookingsService.adminGetAllBookings(filters);
    }

    @Get(':id')
    async getBookingById(@Param('id') id: string) {
        return this.bookingsService.getBookingById(id);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
        @Body('internalNotes') internalNotes?: string
    ) {
        return this.bookingsService.adminUpdateStatus(id, status, internalNotes);
    }

    @Patch(':id/confirm')
    async confirmBooking(@Param('id') id: string) {
        return this.bookingsService.adminConfirmBooking(id);
    }

    @Patch(':id/add-payment')
    async addPayment(@Param('id') id: string, @Body('amount') amount: number) {
        return this.bookingsService.adminUpdatePaidAmount(id, amount);
    }
}
