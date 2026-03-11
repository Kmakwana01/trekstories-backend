import { Controller, Get, Post, Body, Param, UseGuards, Patch, Query, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { BookingsService } from './bookings.service';
import { AdminLogService } from '../admin/services/admin-log.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminBookingsController {
    constructor(
        private readonly bookingsService: BookingsService,
        private readonly adminLogService: AdminLogService,
        private readonly transactionsService: TransactionsService,
    ) { }

    @Get(':id/payment-history')
    async getPaymentHistory(@Param('id') id: string) {
        return this.transactionsService.getMyBookingPaymentHistory(id);
    }

    @Get()
    async getAllBookings(@Query() filters: any) {
        return this.bookingsService.adminGetAllBookings(filters);
    }

    @Get(':id')
    async getBookingById(@Param('id') id: string) {
        const booking = await this.bookingsService.getBookingById(id);
        const paymentHistory = await this.transactionsService.getMyBookingPaymentHistory(id);
        
        return {
            ...booking,
            paymentSummary: paymentHistory
        };
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
        @Body('internalNotes') internalNotes: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const booking = await this.bookingsService.adminUpdateStatus(id, status, internalNotes, adminId);
        await this.adminLogService.logAction(adminId, 'UPDATE_BOOKING_STATUS', 'Bookings', id, { status, internalNotes }, req.ip, req.headers['user-agent']);
        return booking;
    }

    @Patch(':id/confirm')
    async confirmBooking(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const booking = await this.bookingsService.adminConfirmBooking(id);
        await this.adminLogService.logAction(adminId, 'CONFIRM_BOOKING', 'Bookings', id, {}, req.ip, req.headers['user-agent']);
        return booking;
    }

    @Patch(':id/cancel')
    async cancelBooking(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const booking = await this.bookingsService.adminCancelBooking(id);
        await this.adminLogService.logAction(adminId, 'CANCEL_BOOKING', 'Bookings', id, {}, req.ip, req.headers['user-agent']);
        return booking;
    }

    @Patch(':id/verify-receipt')
    async verifyReceipt(
        @Param('id') id: string,
        @Body('approve') approve: boolean,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const booking = await this.bookingsService.adminVerifyReceipt(id, approve, adminId);
        await this.adminLogService.logAction(adminId, approve ? 'APPROVE_RECEIPT' : 'REJECT_RECEIPT', 'Bookings', id, { approve }, req.ip, req.headers['user-agent']);
        return booking;
    }

    @Patch(':id/add-payment')
    async addPayment(
        @Param('id') id: string,
        @Body('amount') amount: number,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const booking = await this.bookingsService.adminUpdatePaidAmount(id, amount);
        await this.adminLogService.logAction(adminId, 'ADD_PAYMENT', 'Bookings', id, { amount }, req.ip, req.headers['user-agent']);
        return booking;
    }
}
