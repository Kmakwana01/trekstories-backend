import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../database/schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import slugify from 'slugify';
import { DateUtil } from '../../utils/date.util';
import { BlogCategory } from '../../common/enums/blog-category.enum';

@Injectable()
export class BlogsService {
    constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) { }

    async create(createBlogDto: CreateBlogDto, authorId: string, featuredImageUrl?: string): Promise<Blog> {
        const slug = this.generateSlug(createBlogDto.title);

        // Check for existing slug (though schema has unique, good to check)
        const existing = await this.blogModel.findOne({ slug });
        if (existing)
        {
            throw new ConflictException('A blog with this title already exists.');
        }

        const newBlog = new this.blogModel({
            ...createBlogDto,
            slug,
            author: authorId,
            ...(featuredImageUrl ? { featuredImage: featuredImageUrl } : {}),
        });
        return newBlog.save();
    }

    async findAllPublished(filters: FilterBlogDto) {
        const { category, tag, search, page = 1, limit = 10 } = filters;
        const query: any = { isPublished: true };

        if (category) query.category = category.toUpperCase();
        if (tag) query.tags = tag;
        if (search)
        {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { title: regex },
                { excerpt: regex },
                { content: regex },
                { category: regex },
                { tags: { $in: [regex] } },
            ];
        }

        const blogs = await this.blogModel
            .find(query)
            .populate('author', 'name email')
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await this.blogModel.countDocuments(query);

        const totalPages = Math.ceil(total / limit);

        return {
            items: blogs,
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };
    }

    async findAllAdmin(filters: FilterBlogDto) {
        const { category, tag, search, page = 1, limit = 10 } = filters;
        const query: any = {}; // No isPublished filter

        if (category) query.category = category.toUpperCase();
        if (tag) query.tags = tag;
        if (search)
        {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { title: regex },
                { excerpt: regex },
                { content: regex },
                { category: regex },
                { tags: { $in: [regex] } },
            ];
        }

        const blogs = await this.blogModel
            .find(query)
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await this.blogModel.countDocuments(query);

        const totalPages = Math.ceil(total / limit);

        return {
            items: blogs,
            total,
            page,
            limit,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        };
    }

    async findOneBySlug(slug: string): Promise<Blog> {
        const blog = await this.blogModel
            .findOne({ slug, isPublished: true })
            .populate('author', 'name email')
            .exec();

        if (!blog)
        {
            throw new NotFoundException(`Blog with slug '${slug}' not found`);
        }

        // Increment view count asynchronously
        blog.viewCount += 1;
        await blog.save();

        return blog;
    }

    async findOneByIdAdmin(id: string): Promise<Blog> {
        const blog = await this.blogModel.findById(id).populate('author', 'name email').exec();
        if (!blog) throw new NotFoundException(`Blog with ID '${id}' not found`);
        return blog;
    }

    async update(id: string, updateBlogDto: UpdateBlogDto, featuredImageUrl?: string): Promise<Blog> {
        const blog = await this.blogModel.findById(id);
        if (!blog) throw new NotFoundException(`Blog with ID '${id}' not found`);

        if (updateBlogDto.title && updateBlogDto.title !== blog.title)
        {
            const newSlug = this.generateSlug(updateBlogDto.title);
            const existing = await this.blogModel.findOne({ slug: newSlug });
            if (existing && existing.id !== id)
            {
                throw new ConflictException('A blog with this title already exists.');
            }
            blog.slug = newSlug;
        }

        Object.assign(blog, updateBlogDto);
        if (featuredImageUrl) blog.featuredImage = featuredImageUrl;
        return blog.save();
    }

    async remove(id: string): Promise<void> {
        const result = await this.blogModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException(`Blog with ID '${id}' not found`);
    }

    async publish(id: string): Promise<Blog> {
        const blog = await this.blogModel.findByIdAndUpdate(
            id,
            { isPublished: true, publishedAt: DateUtil.nowUTC() },
            { returnDocument: 'after' },
        );
        if (!blog) throw new NotFoundException(`Blog with ID '${id}' not found`);
        return blog;
    }

    async unpublish(id: string): Promise<Blog> {
        const blog = await this.blogModel.findByIdAndUpdate(
            id,
            { isPublished: false },
            { returnDocument: 'after' },
        );
        if (!blog) throw new NotFoundException(`Blog with ID '${id}' not found`);
        return blog;
    }

    private generateSlug(title: string): string {
        return slugify(title, { lower: true, strict: true });
    }
}
