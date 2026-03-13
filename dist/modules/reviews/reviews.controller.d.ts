import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from '../../database/schemas/user.schema';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto, user: User): Promise<import("../../database/schemas/review.schema").Review>;
    findAllByTour(tourId: string, page?: number, limit?: number): Promise<{
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
    findAllMyReviews(user: User): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas/review.schema").ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
