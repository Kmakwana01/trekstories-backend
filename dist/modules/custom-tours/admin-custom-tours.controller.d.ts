import { CustomToursService } from './custom-tours.service';
import { FilterCustomTourRequestDto, UpdateCustomTourStatusDto } from './dto/filter-custom-tour-request.dto';
export declare class AdminCustomToursController {
    private readonly service;
    constructor(service: CustomToursService);
    getStats(): Promise<{
        total: number;
        new: number;
        contacted: number;
        closed: number;
    }>;
    getAll(filter: FilterCustomTourRequestDto): Promise<{
        items: (import("./schemas/custom-tour-request.schema").CustomTourRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getOne(id: string): Promise<import("./schemas/custom-tour-request.schema").CustomTourRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStatus(id: string, dto: UpdateCustomTourStatusDto): Promise<import("./schemas/custom-tour-request.schema").CustomTourRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
