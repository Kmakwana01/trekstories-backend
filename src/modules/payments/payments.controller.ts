import { Controller, Post, Get, Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImageUploadService } from '../../common/services/image-upload.service';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly imageUploadService: ImageUploadService,
    ) { }

    @Post('submit-proof')
    @UseInterceptors(FileInterceptor('receiptImage', {
        storage: memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/))
            {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB
        },
    }))
    async submitPaymentProof(
        @CurrentUser('_id') userId: string,
        @Body() dto: any,
        @UploadedFile() file: Express.Multer.File,
    ) {
        console.log("Submit payment proof DTO received:", dto);
        if (!file) throw new BadRequestException('Receipt image is required');

        const receiptImage = await this.imageUploadService.uploadImage(file);

        return this.paymentsService.submitPaymentProof(userId, { ...dto, receiptImage });
    }

    @Get('my')
    async getMyPayments(@CurrentUser('_id') userId: string) {
        return this.paymentsService.getMyPayments(userId);
    }

    @Get(':id')
    async getPaymentById(@Param('id') id: string) {
        return this.paymentsService.getPaymentById(id);
    }

    @Get('history/:bookingId')
    async getMyBookingPaymentHistory(@CurrentUser('_id') userId: string, @Param('bookingId') bookingId: string) {
        return this.paymentsService.getMyBookingPaymentHistory(bookingId, userId);
    }
}
