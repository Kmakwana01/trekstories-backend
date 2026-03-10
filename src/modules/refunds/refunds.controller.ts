import { Controller, Post, Get, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { RequestRefundDto, ApproveRefundDto, RejectRefundDto } from './dto/refund.dto';

@Controller()
export class RefundsController {
    constructor(private readonly refundsService: RefundsService) { }

    // --- User Endpoints ---

    @UseGuards(JwtAuthGuard)
    @Post('refunds/request')
    async requestRefund(
        @Req() req: any,
        @Body() body: RequestRefundDto & { bookingId: string }
    ) {
        return this.refundsService.requestRefund(req.user.userId, body.bookingId, body.reason);
    }

    // --- Admin Endpoints ---

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get('admin/refunds')
    async getRefundRequests(@Query() query: any) {
        return this.refundsService.getRefundRequests(query);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('admin/refunds/:id/approve')
    async approveRefund(
        @Req() req: any,
        @Param('id') bookingId: string,
        @Body() body: ApproveRefundDto
    ) {
        return this.refundsService.adminApproveRefund(req.user.userId, bookingId, body.refundAmount, body.refundAdminNote);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('admin/refunds/:id/reject')
    async rejectRefund(
        @Req() req: any,
        @Param('id') bookingId: string,
        @Body() body: RejectRefundDto
    ) {
        return this.refundsService.adminRejectRefund(req.user.userId, bookingId, body.reason);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('admin/refunds/:id/processed')
    async markRefundProcessed(
        @Req() req: any,
        @Param('id') bookingId: string
    ) {
        return this.refundsService.markRefundProcessed(req.user.userId, bookingId);
    }
}
