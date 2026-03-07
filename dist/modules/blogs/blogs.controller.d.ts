import { BlogsService } from './blogs.service';
import { FilterBlogDto } from './dto/filter-blog.dto';
export declare class BlogsController {
    private readonly blogsService;
    constructor(blogsService: BlogsService);
    findAll(filterBlogDto: FilterBlogDto): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("../../database/schemas/blog.schema").BlogDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/blog.schema").Blog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findOne(slug: string): Promise<import("../../database/schemas/blog.schema").Blog>;
}
