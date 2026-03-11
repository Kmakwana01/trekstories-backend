import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { AdminBlogsController } from './admin-blogs.controller';
import { Blog, BlogSchema } from '../../database/schemas/blog.schema';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    AdminModule,
  ],
  controllers: [BlogsController, AdminBlogsController],
  providers: [BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
