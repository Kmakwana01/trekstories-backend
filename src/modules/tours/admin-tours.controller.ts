import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    UseInterceptors,
    UploadedFiles,
    Req,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto, UpdateTourDto } from './dto/create-tour.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { AdminLogService } from '../admin/services/admin-log.service';

const tourMulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = './uploads/tours';
            if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/))
        {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    },
};

@Controller('admin/tours')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminToursController {
    constructor(
        private readonly toursService: ToursService,
        private readonly adminLogService: AdminLogService,
    ) { }

    @Get()
    async getTours(@Query() pagination: PaginationQuery) {
        return this.toursService.adminGetTours(pagination);
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'thumbnailImage', maxCount: 1 },
    ], tourMulterOptions))
    async createTour(
        @Body() createTourDto: CreateTourDto,
        @UploadedFiles() files: { images?: Express.Multer.File[], thumbnailImage?: Express.Multer.File[] },
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const imageUrls = files?.images?.map(f => `/uploads/tours/${f.filename}`) || [];
        const thumbnailUrl = files?.thumbnailImage?.[0]
            ? `/uploads/tours/${files.thumbnailImage[0].filename}`
            : undefined;
        const tour = await this.toursService.adminCreateTour(createTourDto, imageUrls, thumbnailUrl);
        await this.adminLogService.logAction(adminId, 'CREATE_TOUR', 'Tours', (tour as any)._id?.toString(), { title: tour.title }, req.ip);
        return tour;
    }

    @Get(':id')
    async getTourById(@Param('id') id: string) {
        return this.toursService.adminGetTourById(id);
    }

    @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'images', maxCount: 10 },
        { name: 'thumbnailImage', maxCount: 1 },
    ], tourMulterOptions))
    async updateTour(
        @Param('id') id: string,
        @Body() updateTourDto: UpdateTourDto,
        @UploadedFiles() files: { images?: Express.Multer.File[], thumbnailImage?: Express.Multer.File[] },
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const imageUrls = files?.images?.map(f => `/uploads/tours/${f.filename}`) || [];
        const thumbnailUrl = files?.thumbnailImage?.[0]
            ? `/uploads/tours/${files.thumbnailImage[0].filename}`
            : undefined;
        const tour = await this.toursService.adminUpdateTour(id, updateTourDto, imageUrls, thumbnailUrl);
        await this.adminLogService.logAction(adminId, 'UPDATE_TOUR', 'Tours', id, { fields: Object.keys(updateTourDto) }, req.ip);
        return tour;
    }

    @Delete(':id')
    async deleteTour(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        await this.toursService.adminSoftDelete(id);
        await this.adminLogService.logAction(adminId, 'DELETE_TOUR', 'Tours', id, {}, req.ip);
        return { message: 'Tour deleted (soft delete) successfully' };
    }

    @Patch(':id/status')
    async toggleStatus(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const tour = await this.toursService.toggleStatus(id);
        await this.adminLogService.logAction(adminId, 'TOGGLE_TOUR_STATUS', 'Tours', id, { isActive: tour.isActive }, req.ip);
        return tour;
    }

    @Patch(':id/featured')
    async toggleFeatured(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const tour = await this.toursService.toggleFeatured(id);
        await this.adminLogService.logAction(adminId, 'TOGGLE_TOUR_FEATURED', 'Tours', id, { isFeatured: tour.isFeatured }, req.ip);
        return tour;
    }

    // Keep individual image delete endpoint
    @Delete(':id/images')
    async deleteImage(
        @Param('id') id: string,
        @Body('imageUrl') imageUrl: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        await this.toursService.removeImage(id, imageUrl);
        await this.adminLogService.logAction(adminId, 'DELETE_TOUR_IMAGE', 'Tours', id, { imageUrl }, req.ip);
        return { message: 'Image removed successfully' };
    }
}
