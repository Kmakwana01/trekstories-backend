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
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { AdminLogService } from '../admin/services/admin-log.service';
import { ImgbbService } from '../../common/services/imgbb.service';
import { FormDataParserInterceptor } from '../../common/interceptors/form-data-parser.interceptor';

const tourMulterOptions = {
    storage: memoryStorage(),
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
        private readonly imgbbService: ImgbbService,
    ) { }

    @Get()
    async getTours(@Query() pagination: PaginationQuery) {
        return this.toursService.adminGetTours(pagination);
    }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'images', maxCount: 10 },
            { name: 'thumbnailImage', maxCount: 1 },
        ], tourMulterOptions),
        FormDataParserInterceptor
    )
    async createTour(
        @Body() createTourDto: CreateTourDto,
        @UploadedFiles() files: { images?: Express.Multer.File[], thumbnailImage?: Express.Multer.File[] },
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        console.log('--- REQ.BODY IN CONTROLLER ---');
        console.log(req.body);
        console.log('--- DTO IN CONTROLLER ---');
        console.log(createTourDto);
        let imageUrls: string[] = [];
        if (files?.images)
        {
            imageUrls = await this.imgbbService.uploadImages(files.images);
        }

        let thumbnailUrl: string | undefined;
        if (files?.thumbnailImage?.[0])
        {
            thumbnailUrl = await this.imgbbService.uploadImage(files.thumbnailImage[0]);
        }

        const tour = await this.toursService.adminCreateTour(createTourDto, imageUrls, thumbnailUrl);
        await this.adminLogService.logAction(adminId, 'CREATE_TOUR', 'Tours', (tour as any)._id?.toString(), { title: tour.title }, req.ip);
        return tour;
    }

    @Get(':id')
    async getTourById(@Param('id') id: string) {
        return this.toursService.adminGetTourById(id);
    }

    @Patch(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'images', maxCount: 10 },
            { name: 'thumbnailImage', maxCount: 1 },
        ], tourMulterOptions),
        FormDataParserInterceptor
    )
    async updateTour(
        @Param('id') id: string,
        @Body() updateTourDto: UpdateTourDto,
        @UploadedFiles() files: { images?: Express.Multer.File[], thumbnailImage?: Express.Multer.File[] },
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        // console.log('RAW BODY:', req.body);
        console.log(updateTourDto);
        let imageUrls: string[] = [];
        if (files?.images)
        {
            imageUrls = await this.imgbbService.uploadImages(files.images);
        }

        let thumbnailUrl: string | undefined;
        if (files?.thumbnailImage?.[0])
        {
            thumbnailUrl = await this.imgbbService.uploadImage(files.thumbnailImage[0]);
        }

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
