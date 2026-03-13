"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const blog_schema_1 = require("../../database/schemas/blog.schema");
const slugify_1 = __importDefault(require("slugify"));
const date_util_1 = require("../../utils/date.util");
let BlogsService = class BlogsService {
    blogModel;
    constructor(blogModel) {
        this.blogModel = blogModel;
    }
    async create(createBlogDto, authorId, featuredImageUrl) {
        const slug = this.generateSlug(createBlogDto.title);
        const existing = await this.blogModel.findOne({ slug });
        if (existing) {
            throw new common_1.ConflictException('A blog with this title already exists.');
        }
        const newBlog = new this.blogModel({
            ...createBlogDto,
            slug,
            author: authorId,
            ...(featuredImageUrl ? { featuredImage: featuredImageUrl } : {}),
        });
        return newBlog.save();
    }
    async findAllPublished(filters) {
        const { category, tag, search, page = 1, limit = 10 } = filters;
        const query = { isPublished: true };
        if (category)
            query.category = category.toUpperCase();
        if (tag)
            query.tags = tag;
        if (search) {
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
    async findAllAdmin(filters) {
        const { category, tag, search, page = 1, limit = 10 } = filters;
        const query = {};
        if (category)
            query.category = category.toUpperCase();
        if (tag)
            query.tags = tag;
        if (search) {
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
    async findOneBySlug(slug) {
        const blog = await this.blogModel
            .findOne({ slug, isPublished: true })
            .populate('author', 'name email')
            .exec();
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with slug '${slug}' not found`);
        }
        blog.viewCount += 1;
        await blog.save();
        return blog;
    }
    async findOneByIdAdmin(id) {
        const blog = await this.blogModel
            .findById(id)
            .populate('author', 'name email')
            .exec();
        if (!blog)
            throw new common_1.NotFoundException(`Blog with ID '${id}' not found`);
        return blog;
    }
    async update(id, updateBlogDto, featuredImageUrl) {
        const blog = await this.blogModel.findById(id);
        if (!blog)
            throw new common_1.NotFoundException(`Blog with ID '${id}' not found`);
        if (updateBlogDto.title && updateBlogDto.title !== blog.title) {
            const newSlug = this.generateSlug(updateBlogDto.title);
            const existing = await this.blogModel.findOne({ slug: newSlug });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('A blog with this title already exists.');
            }
            blog.slug = newSlug;
        }
        Object.assign(blog, updateBlogDto);
        if (featuredImageUrl)
            blog.featuredImage = featuredImageUrl;
        return blog.save();
    }
    async remove(id) {
        const result = await this.blogModel.findByIdAndDelete(id);
        if (!result)
            throw new common_1.NotFoundException(`Blog with ID '${id}' not found`);
    }
    async publish(id) {
        const blog = await this.blogModel.findByIdAndUpdate(id, { isPublished: true, publishedAt: date_util_1.DateUtil.nowUTC() }, { returnDocument: 'after' });
        if (!blog)
            throw new common_1.NotFoundException(`Blog with ID '${id}' not found`);
        return blog;
    }
    async unpublish(id) {
        const blog = await this.blogModel.findByIdAndUpdate(id, { isPublished: false }, { returnDocument: 'after' });
        if (!blog)
            throw new common_1.NotFoundException(`Blog with ID '${id}' not found`);
        return blog;
    }
    generateSlug(title) {
        return (0, slugify_1.default)(title, { lower: true, strict: true });
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(blog_schema_1.Blog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogsService);
//# sourceMappingURL=blogs.service.js.map