import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { AdminBlogsController } from './admin-blogs.controller';
import { Blog, BlogSchema } from '../../database/schemas/blog.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    ],
    controllers: [BlogsController, AdminBlogsController],
    providers: [BlogsService],
    exports: [BlogsService],
})
export class BlogsModule { }
