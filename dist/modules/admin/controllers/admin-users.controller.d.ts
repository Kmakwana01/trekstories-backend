import { AdminCrmService } from '../services/admin-crm.service';
import { AdminLogService } from '../services/admin-log.service';
import type { UserDocument } from '../../../database/schemas/user.schema';
import { PaginationQuery } from '../../../common/helpers/pagination.helper';
export declare class AdminUsersController {
    private crmService;
    private adminLogService;
    constructor(crmService: AdminCrmService, adminLogService: AdminLogService);
    getAllUsers(pagination: PaginationQuery, search: string, isVerified: string, isBlocked: string): Promise<import("../../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    getUserById(id: string): Promise<{
        user: any;
        totalBookings: number;
        totalSpent: number;
        bookings: (import("../../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    blockUser(id: string, reason: string, admin: UserDocument, req: any): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../../database/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    unblockUser(id: string, admin: UserDocument, req: any): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../../database/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    addUserNote(id: string, note: string, admin: UserDocument, req: any): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../../database/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
