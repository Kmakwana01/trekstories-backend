import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../database/schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
export declare class BlogsService {
    private blogModel;
    constructor(blogModel: Model<BlogDocument>);
    create(createBlogDto: CreateBlogDto, authorId: string, featuredImageUrl?: string): Promise<Blog>;
    findAllPublished(filters: FilterBlogDto): Promise<{
        items: (import("mongoose").Document<unknown, {}, BlogDocument, {}, import("mongoose").DefaultSchemaOptions> & Blog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findAllAdmin(filters: FilterBlogDto): Promise<{
        items: (import("mongoose").Document<unknown, {}, BlogDocument, {}, import("mongoose").DefaultSchemaOptions> & Blog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOneBySlug(slug: string): Promise<Blog>;
    findOneByIdAdmin(id: string): Promise<Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto, featuredImageUrl?: string): Promise<Blog>;
    remove(id: string): Promise<void>;
    publish(id: string): Promise<Blog>;
    unpublish(id: string): Promise<Blog>;
    private generateSlug;
}
