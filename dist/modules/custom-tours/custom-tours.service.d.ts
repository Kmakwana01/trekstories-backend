import { Model } from 'mongoose';
import { CustomTourRequest, CustomTourRequestDocument } from './schemas/custom-tour-request.schema';
import { CreateCustomTourRequestDto } from './dto/create-custom-tour-request.dto';
import { FilterCustomTourRequestDto, UpdateCustomTourStatusDto } from './dto/filter-custom-tour-request.dto';
export declare class CustomToursService {
    private readonly model;
    constructor(model: Model<CustomTourRequestDocument>);
    create(dto: CreateCustomTourRequestDto): Promise<import("mongoose").Document<unknown, {}, CustomTourRequestDocument, {}, import("mongoose").DefaultSchemaOptions> & CustomTourRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(filter: FilterCustomTourRequestDto): Promise<{
        items: (CustomTourRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<CustomTourRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStatus(id: string, dto: UpdateCustomTourStatusDto): Promise<CustomTourRequest & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getStats(): Promise<{
        total: number;
        new: number;
        contacted: number;
        closed: number;
    }>;
}
