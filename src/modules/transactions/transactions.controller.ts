import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
  Res,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImageUploadService } from '../../common/services/image-upload.service';

const receiptMulter = {
  storage: memoryStorage(),
  fileFilter: (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      return cb(new Error('Only image and pdf files are allowed'), false);
    }
    cb(null, true);
  },
};

@Controller()
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @Get('transactions/my')
  async getMyTransactions(@CurrentUser('_id') userId: string) {
    return this.transactionsService.getUserTransactions(userId);
  }

  @Get('transactions/:id')
  async getTransactionById(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
  ) {
    const transaction = await this.transactionsService.getTransactionById(
      id,
      userId,
    );
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  @Post('transactions/submit-proof')
  @UseInterceptors(FileInterceptor('receiptImage', receiptMulter))
  async submitPaymentProof(
    @CurrentUser('_id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    dto: {
      bookingId: string;
      transactionId: string;
      paymentMethod: string;
      paymentAmount?: string | number;
    },
  ) {
    if (!file) {
      throw new BadRequestException('Receipt image is required');
    }
    if (!dto.bookingId || !dto.transactionId) {
      throw new BadRequestException(
        'Booking ID and Transaction ID are required',
      );
    }

    const receiptImageUrl = await this.imageUploadService.uploadImage(file);

    return this.transactionsService.submitPaymentProof(userId, {
      bookingId: dto.bookingId,
      transactionId: dto.transactionId,
      paymentMethod: dto.paymentMethod,
      paymentAmount: dto.paymentAmount ? Number(dto.paymentAmount) : undefined,
      receiptImage: receiptImageUrl,
    });
  }
}
