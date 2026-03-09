import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BookingsService } from './bookings.service';
import { PreviewBookingDto } from './dto/preview-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post('preview')
    async preview(@Body() dto: PreviewBookingDto) {
        return this.bookingsService.previewBooking(dto);
    }

    @Post('create')
    async create(@CurrentUser('_id') userId: string, @Body() dto: CreateBookingDto) {
        return this.bookingsService.createBooking(userId, dto);
    }

    @Get('my-bookings')
    async getMyBookings(@CurrentUser('_id') userId: string) {
        return this.bookingsService.getMyBookings(userId);
    }

    @Get(':id')
    async getBookingById(@CurrentUser('_id') userId: string, @Param('id') id: string) {
        return this.bookingsService.getBookingById(id, userId);
    }

    @Delete(':id/cancel')
    async cancelBooking(@CurrentUser('_id') userId: string, @Param('id') id: string) {
        return this.bookingsService.cancelBooking(id, userId);
    }

    @Get(':id/payment-summary')
    async getPaymentSummary(@CurrentUser('_id') userId: string, @Param('id') id: string) {
        const booking = await this.bookingsService.getBookingById(id, userId);
        return {
            totalAmount: booking.totalAmount,
            paidAmount: booking.paidAmount,
            pendingAmount: booking.pendingAmount,
            paymentType: booking.paymentType
        };
    }
}
