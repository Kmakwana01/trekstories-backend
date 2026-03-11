import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { TransactionsService } from './transactions.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
import { IsOptional, IsString } from 'class-validator';

class AdminTransactionFilterDto extends PaginationQuery {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

@Controller('admin/transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminTransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('pending-receipts')
  async getPendingReceipts(@Query() query: any) {
    return this.transactionsService.getAllTransactions(
      {
        type: 'ONLINE_RECEIPT',
        status: 'PENDING',
      },
      query,
    );
  }

  @Get('export')
  async exportTransactions(@Res() res: Response, @Query() filters: any) {
    const buffer = await this.transactionsService.exportToCSV(filters);
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=transactions.csv',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get()
  async getAllTransactions(@Query() query: AdminTransactionFilterDto) {
    const { page, limit, sort, order, search, ...filters } = query;
    return this.transactionsService.getAllTransactions(filters, query);
  }

  @Get(':id')
  async getAdminTransactionById(@Param('id') id: string) {
    const transaction = await this.transactionsService.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @Patch(':id/approve')
  async approveReceipt(
    @Param('id') id: string,
    @CurrentUser('_id') adminId: string,
  ) {
    return this.transactionsService.approvePayment(id, adminId);
  }

  @Patch(':id/reject')
  async rejectReceipt(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser('_id') adminId: string,
  ) {
    return this.transactionsService.rejectPayment(id, adminId, reason);
  }

  @Post('offline')
  async recordOfflinePayment(
    @CurrentUser('_id') adminId: string,
    @Body()
    dto: {
      bookingId: string;
      amount: number;
      paymentMethod: string;
      notes?: string;
      receiptNumber?: string;
      collectedAt?: string;
    },
  ) {
    return this.transactionsService.recordOfflinePayment(adminId, dto);
  }
}
