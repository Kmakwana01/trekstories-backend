import { ToursService } from './tours.service';
import { CreateTourDto, UpdateTourDto } from './dto/create-tour.dto';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
import { AdminLogService } from '../admin/services/admin-log.service';
import { ImageUploadService } from '../../common/services/image-upload.service';
export declare class AdminToursController {
    private readonly toursService;
    private readonly adminLogService;
    private readonly imageUploadService;
    constructor(toursService: ToursService, adminLogService: AdminLogService, imageUploadService: ImageUploadService);
    getTours(pagination: PaginationQuery): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    createTour(createTourDto: CreateTourDto, files: {
        images?: Express.Multer.File[];
        thumbnailImage?: Express.Multer.File[];
        brochure?: Express.Multer.File[];
    }, adminId: string, req: any): Promise<import("../../database/schemas/tour.schema").TourDocument>;
    getTourById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/tour.schema").TourDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/tour.schema").Tour & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateTour(id: string, updateTourDto: UpdateTourDto, files: {
        images?: Express.Multer.File[];
        thumbnailImage?: Express.Multer.File[];
        brochure?: Express.Multer.File[];
    }, adminId: string, req: any): Promise<import("../../database/schemas/tour.schema").TourDocument>;
    deleteTour(id: string, adminId: string, req: any): Promise<{
        message: string;
    }>;
    toggleStatus(id: string, adminId: string, req: any): Promise<import("../../database/schemas/tour.schema").TourDocument>;
    toggleFeatured(id: string, adminId: string, req: any): Promise<import("../../database/schemas/tour.schema").TourDocument>;
    deleteImage(id: string, imageUrl: string, adminId: string, req: any): Promise<{
        message: string;
    }>;
}
