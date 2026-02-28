import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, Query, UseInterceptors, UploadedFile, Req,
    // FileInterceptor, // removed from here
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';
import { AdminLogService } from '../admin/services/admin-log.service';
import type { UserDocument } from '../../database/schemas/user.schema';
import { ImgbbService } from '../../common/services/imgbb.service';

const blogMulter = {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/))
        {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
};

@Controller('admin/blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminBlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly adminLogService: AdminLogService,
        private readonly imgbbService: ImgbbService,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('featuredImage', blogMulter))
    async create(
        @Body() createBlogDto: CreateBlogDto,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: UserDocument,
        @Req() req: any,
    ) {
        let featuredImageUrl: string | undefined;
        if (file)
        {
            featuredImageUrl = await this.imgbbService.uploadImage(file);
        }
        const blog = await this.blogsService.create(createBlogDto, (user as any)._id.toString(), featuredImageUrl);
        await this.adminLogService.logAction((user as any)._id.toString(), 'CREATE_BLOG', 'Blogs', (blog as any)._id?.toString(), { title: createBlogDto.title }, req.ip);
        return blog;
    }

    @Get()
    findAll(@Query() filterBlogDto: FilterBlogDto) {
        return this.blogsService.findAllAdmin(filterBlogDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.blogsService.findOneByIdAdmin(id);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('featuredImage', blogMulter))
    async update(
        @Param('id') id: string,
        @Body() updateBlogDto: UpdateBlogDto,
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: UserDocument,
        @Req() req: any,
    ) {
        let featuredImageUrl: string | undefined;
        if (file)
        {
            featuredImageUrl = await this.imgbbService.uploadImage(file);
        }
        const blog = await this.blogsService.update(id, updateBlogDto, featuredImageUrl);
        await this.adminLogService.logAction((user as any)._id.toString(), 'UPDATE_BLOG', 'Blogs', id, { fields: Object.keys(updateBlogDto) }, req.ip);
        return blog;
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @CurrentUser() user: UserDocument,
        @Req() req: any,
    ) {
        await this.blogsService.remove(id);
        await this.adminLogService.logAction((user as any)._id.toString(), 'DELETE_BLOG', 'Blogs', id, {}, req.ip);
        return { message: 'Blog deleted successfully' };
    }

    @Patch(':id/publish')
    async publish(
        @Param('id') id: string,
        @CurrentUser() user: UserDocument,
        @Req() req: any,
    ) {
        const blog = await this.blogsService.publish(id);
        await this.adminLogService.logAction((user as any)._id.toString(), 'PUBLISH_BLOG', 'Blogs', id, {}, req.ip);
        return blog;
    }

    @Patch(':id/unpublish')
    async unpublish(
        @Param('id') id: string,
        @CurrentUser() user: UserDocument,
        @Req() req: any,
    ) {
        const blog = await this.blogsService.unpublish(id);
        await this.adminLogService.logAction((user as any)._id.toString(), 'UNPUBLISH_BLOG', 'Blogs', id, {}, req.ip);
        return blog;
    }
}
