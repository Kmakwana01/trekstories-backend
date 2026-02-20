import { Controller, Get, UseGuards, Query, Param, Res, NotFoundException } from '@nestjs/common';
import type { Response } from 'express';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller()
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Get('transactions/my')
    async getMyTransactions(@CurrentUser('_id') userId: string) {
        return this.transactionsService.getUserTransactions(userId);
    }

    @Get('transactions/:id')
    async getTransactionById(@Param('id') id: string, @CurrentUser('_id') userId: string) {
        const transaction = await this.transactionsService.getTransactionById(id, userId);
        if (!transaction)
        {
            throw new NotFoundException('Transaction not found');
        }
        return transaction;
    }

    @Get('admin/transactions/export')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async exportTransactions(@Res() res: Response, @Query() filters: any) {
        const buffer = await this.transactionsService.exportToCSV(filters);
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=transactions.csv',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }

    @Get('admin/transactions')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async getAllTransactions(@Query() filters: any) {
        return this.transactionsService.getAllTransactions(filters);
    }

    @Get('admin/transactions/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async getAdminTransactionById(@Param('id') id: string) {
        const transaction = await this.transactionsService.getTransactionById(id);
        if (!transaction)
        {
            throw new NotFoundException('Transaction not found');
        }
        return transaction;
    }
}
