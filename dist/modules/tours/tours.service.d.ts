import { Model } from 'mongoose';
import { Tour, TourDocument } from '../../database/schemas/tour.schema';
import { TourDateDocument } from '../../database/schemas/tour-date.schema';
import { ReviewDocument } from '../../database/schemas/review.schema';
import { CreateTourDto, UpdateTourDto } from './dto/create-tour.dto';
import { TourFiltersDto } from './dto/tour-filters.dto';
import { PaginationResult } from '../../common/helpers/pagination.helper';
export declare class ToursService {
    private tourModel;
    private tourDateModel;
    private reviewModel;
    private readonly logger;
    constructor(tourModel: Model<TourDocument>, tourDateModel: Model<TourDateDocument>, reviewModel: Model<ReviewDocument>);
    getAllTours(filters: TourFiltersDto): Promise<PaginationResult<TourDocument>>;
    getTourBySlug(slug: string): Promise<any>;
    getTourDates(tourId: string): Promise<TourDateDocument[]>;
    getFilterOptions(): Promise<{
        states: string[];
        categories: string[];
        departureCities: string[];
    }>;
    getByState(state: string, pagination: any): Promise<PaginationResult<unknown>>;
    adminCreateTour(createTourDto: CreateTourDto, uploadedImages?: string[], thumbnailUrl?: string): Promise<TourDocument>;
    adminUpdateTour(id: string, updateTourDto: UpdateTourDto, uploadedImages?: string[], thumbnailUrl?: string): Promise<TourDocument>;
    adminSoftDelete(id: string): Promise<void>;
    toggleStatus(id: string): Promise<TourDocument>;
    toggleFeatured(id: string): Promise<TourDocument>;
    adminGetTours(pagination: any): Promise<PaginationResult<unknown>>;
    adminGetTourById(id: string): Promise<import("mongoose").Document<unknown, {}, TourDocument, {}, import("mongoose").DefaultSchemaOptions> & Tour & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    addImage(id: string, imageUrl: string): Promise<(import("mongoose").Document<unknown, {}, TourDocument, {}, import("mongoose").DefaultSchemaOptions> & Tour & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    removeImage(id: string, imageUrl: string): Promise<(import("mongoose").Document<unknown, {}, TourDocument, {}, import("mongoose").DefaultSchemaOptions> & Tour & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
