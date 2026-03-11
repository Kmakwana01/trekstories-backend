import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RefundsService } from './refunds.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import {
  RequestRefundDto,
  ApproveRefundDto,
  RejectRefundDto,
} from './dto/refund.dto';

@Controller()
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  // --- User Endpoints ---

  @UseGuards(JwtAuthGuard)
  @Post('refunds/request')
  async requestRefund(
    @CurrentUser('_id') userId: string,
    @Body() body: RequestRefundDto & { bookingId: string },
  ) {
    return this.refundsService.requestRefund(
      userId,
      body.bookingId,
      body.reason,
    );
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
    @CurrentUser('_id') adminId: string,
    @Param('id') bookingId: string,
    @Body() body: ApproveRefundDto,
  ) {
    return this.refundsService.adminApproveRefund(
      adminId,
      bookingId,
      body.refundAmount,
      body.refundAdminNote,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/refunds/:id/reject')
  async rejectRefund(
    @CurrentUser('_id') adminId: string,
    @Param('id') bookingId: string,
    @Body() body: RejectRefundDto,
  ) {
    return this.refundsService.adminRejectRefund(
      adminId,
      bookingId,
      body.reason,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/refunds/:id/processed')
  async markRefundProcessed(
    @CurrentUser('_id') adminId: string,
    @Param('id') bookingId: string,
  ) {
    return this.refundsService.markRefundProcessed(adminId, bookingId);
  }
}
