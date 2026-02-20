import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { FilterBlogDto } from './dto/filter-blog.dto';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) { }

    @Get()
    findAll(@Query() filterBlogDto: FilterBlogDto) {
        return this.blogsService.findAllPublished(filterBlogDto);
    }

    @Get(':slug')
    findOne(@Param('slug') slug: string) {
        return this.blogsService.findOneBySlug(slug);
    }
}
