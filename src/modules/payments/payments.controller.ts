import { Controller, Post, Get, Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('submit-proof')
    @UseInterceptors(FileInterceptor('receiptImage', {
        storage: diskStorage({
            destination: './uploads/receipts',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
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
        if (!file) throw new BadRequestException('Receipt image is required');

        // Construct file path relative to domain or absolute? 
        // We'll store the relative path.
        const receiptImage = `/uploads/receipts/${file.filename}`;

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
}
