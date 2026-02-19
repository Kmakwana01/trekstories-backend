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
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto, UpdateTourDto } from './dto/create-tour.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

@Controller('admin/tours')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminToursController {
    constructor(private readonly toursService: ToursService) { }

    @Get()
    async getTours(@Query() pagination: PaginationQuery) {
        return this.toursService.adminGetTours(pagination);
    }

    @Post()
    async createTour(@Body() createTourDto: CreateTourDto) {
        return this.toursService.adminCreateTour(createTourDto);
    }

    @Get(':id')
    async getTourById(@Param('id') id: string) {
        return this.toursService.adminGetTourById(id);
    }

    @Patch(':id')
    async updateTour(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
        return this.toursService.adminUpdateTour(id, updateTourDto);
    }

    @Delete(':id')
    async deleteTour(@Param('id') id: string) {
        await this.toursService.adminSoftDelete(id);
        return { message: 'Tour deleted (soft delete) successfully' };
    }

    @Patch(':id/status')
    async toggleStatus(@Param('id') id: string) {
        return this.toursService.toggleStatus(id);
    }

    @Patch(':id/featured')
    async toggleFeatured(@Param('id') id: string) {
        return this.toursService.toggleFeatured(id);
    }

    @Post(':id/images')
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = './uploads/tours';
                if (!fs.existsSync(uploadPath))
                {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
            {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    }))
    async uploadImages(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const imageUrls = files.map(file => `/uploads/tours/${file.filename}`);
        for (const url of imageUrls)
        {
            await this.toursService.addImage(id, url);
        }
        return { message: 'Images uploaded successfully', imageUrls };
    }

    @Delete(':id/images')
    async deleteImage(@Param('id') id: string, @Body('imageUrl') imageUrl: string) {
        await this.toursService.removeImage(id, imageUrl);
        return { message: 'Image removed successfully' };
    }
}
