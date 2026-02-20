import { Controller, Get, Post, Patch, Body, Param, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from '../payments.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Role } from '../../../common/enums/roles.enum';

@Controller('admin/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminPaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Get('pending-review')
    async getPendingPayments() {
        return this.paymentsService.getPendingPayments();
    }

    @Patch(':id/approve')
    async approvePayment(@Param('id') id: string, @CurrentUser('_id') adminId: string) {
        return this.paymentsService.approvePayment(id, adminId);
    }

    @Patch(':id/reject')
    async rejectPayment(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Body('reason') reason: string
    ) {
        return this.paymentsService.rejectPayment(id, adminId, reason);
    }

    @Post('offline')
    async recordOfflinePayment(
        @CurrentUser('_id') adminId: string,
        @Body() dto: any
    ) {
        return this.paymentsService.recordOfflinePayment(adminId, dto);
    }
}
