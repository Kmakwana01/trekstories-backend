import { Controller, Get, Post, Patch, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { PaymentsService } from '../payments.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Role } from '../../../common/enums/roles.enum';
import { AdminLogService } from '../../admin/services/admin-log.service';
import { PaginationQuery } from '../../../common/helpers/pagination.helper';

@Controller('admin/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminPaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly adminLogService: AdminLogService,
    ) { }

    @Get('pending-review')
    async getPendingPayments(@Query() query: PaginationQuery) {
        return this.paymentsService.getPendingPayments(query);
    }

    @Patch(':id/approve')
    async approvePayment(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const payment = await this.paymentsService.approvePayment(id, adminId);
        await this.adminLogService.logAction(adminId, 'APPROVE_PAYMENT', 'Payments', id, { amount: (payment as any).amount }, req.ip, req.headers['user-agent']);
        return payment;
    }

    @Patch(':id/reject')
    async rejectPayment(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Body('reason') reason: string,
        @Req() req: any,
    ) {
        const payment = await this.paymentsService.rejectPayment(id, adminId, reason);
        await this.adminLogService.logAction(adminId, 'REJECT_PAYMENT', 'Payments', id, { reason }, req.ip, req.headers['user-agent']);
        return payment;
    }

    @Post('offline')
    async recordOfflinePayment(
        @CurrentUser('_id') adminId: string,
        @Body() dto: any,
        @Req() req: any,
    ) {
        const payment = await this.paymentsService.recordOfflinePayment(adminId, dto);
        await this.adminLogService.logAction(adminId, 'RECORD_OFFLINE_PAYMENT', 'Payments', dto.bookingId, { amount: dto.amount, method: dto.paymentMethod }, req.ip, req.headers['user-agent']);
        return payment;
    }

    @Get('history/:bookingId')
    async getBookingPaymentHistory(@Param('bookingId') bookingId: string) {
        return this.paymentsService.getMyBookingPaymentHistory(bookingId);
    }
}
