import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilterBlogDto } from './dto/filter-blog.dto';
import { AdminLogService } from '../admin/services/admin-log.service';
import type { UserDocument } from '../../database/schemas/user.schema';
import { ImgbbService } from '../../common/services/imgbb.service';
export declare class AdminBlogsController {
    private readonly blogsService;
    private readonly adminLogService;
    private readonly imgbbService;
    constructor(blogsService: BlogsService, adminLogService: AdminLogService, imgbbService: ImgbbService);
    create(createBlogDto: CreateBlogDto, file: Express.Multer.File, user: UserDocument, req: any): Promise<import("../../database/schemas/blog.schema").Blog>;
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
    findOne(id: string): Promise<import("../../database/schemas/blog.schema").Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto, file: Express.Multer.File, user: UserDocument, req: any): Promise<import("../../database/schemas/blog.schema").Blog>;
    remove(id: string, user: UserDocument, req: any): Promise<{
        message: string;
    }>;
    publish(id: string, user: UserDocument, req: any): Promise<import("../../database/schemas/blog.schema").Blog>;
    unpublish(id: string, user: UserDocument, req: any): Promise<import("../../database/schemas/blog.schema").Blog>;
}
