import { ReviewsService } from './reviews.service';
import { FilterReviewDto } from './dto/filter-review.dto';
import { RejectReviewDto } from './dto/reject-review.dto';
import { AdminLogService } from '../admin/services/admin-log.service';
export declare class AdminReviewsController {
    private readonly reviewsService;
    private readonly adminLogService;
    constructor(reviewsService: ReviewsService, adminLogService: AdminLogService);
    findAll(filterReviewDto: FilterReviewDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../../database/schemas/review.schema").ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    }>;
    approve(id: string, adminId: string, req: any): Promise<import("../../database/schemas/review.schema").Review>;
    reject(id: string, rejectReviewDto: RejectReviewDto, adminId: string, req: any): Promise<import("../../database/schemas/review.schema").Review>;
    remove(id: string, adminId: string, req: any): Promise<{
        message: string;
    }>;
}
