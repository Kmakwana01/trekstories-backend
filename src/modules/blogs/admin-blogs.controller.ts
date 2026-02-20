import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';
import { User } from '../../database/schemas/user.schema';

@Controller('admin/blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminBlogsController {
    constructor(private readonly blogsService: BlogsService) { }

    @Post()
    create(@Body() createBlogDto: CreateBlogDto, @CurrentUser() user: User) {
        return this.blogsService.create(createBlogDto, (user as any)._id.toString());
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
    update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
        return this.blogsService.update(id, updateBlogDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.blogsService.remove(id);
    }

    @Patch(':id/publish')
    publish(@Param('id') id: string) {
        return this.blogsService.publish(id);
    }

    @Patch(':id/unpublish')
    unpublish(@Param('id') id: string) {
        return this.blogsService.unpublish(id);
    }
}
