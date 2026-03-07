import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../../database/schemas/user.schema';
import { BookingDocument } from '../../../database/schemas/booking.schema';
import { AdminLogService } from './admin-log.service';
export declare class AdminCrmService {
    private userModel;
    private bookingModel;
    private adminLogService;
    constructor(userModel: Model<UserDocument>, bookingModel: Model<BookingDocument>, adminLogService: AdminLogService);
    getAllUsers(filters: any, paginationQuery: any): Promise<import("../../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    getUserById(id: string): Promise<{
        user: any;
        stats: {
            bookingCount: number;
            totalSpent: number;
        };
    }>;
    blockUser(id: string, adminId: string, reason: string, ip: string, userAgent?: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    unblockUser(id: string, adminId: string, ip: string, userAgent?: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    addUserNote(id: string, note: string): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
