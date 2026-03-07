import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../../database/schemas/review.schema';
import { BookingDocument } from '../../database/schemas/booking.schema';
import { TourDocument } from '../../database/schemas/tour.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { FilterReviewDto } from './dto/filter-review.dto';
export declare class ReviewsService {
    private reviewModel;
    private bookingModel;
    private tourModel;
    constructor(reviewModel: Model<ReviewDocument>, bookingModel: Model<BookingDocument>, tourModel: Model<TourDocument>);
    create(userId: string, createReviewDto: CreateReviewDto): Promise<Review>;
    findAllByTour(tourId: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    findAllByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findAllAdmin(filters: FilterReviewDto): Promise<{
        data: (import("mongoose").Document<unknown, {}, ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    approve(id: string): Promise<Review>;
    reject(id: string, reason: string): Promise<Review>;
    delete(id: string): Promise<void>;
    private updateTourRating;
}
