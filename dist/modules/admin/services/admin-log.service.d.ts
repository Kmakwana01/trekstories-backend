import { Model } from 'mongoose';
import { AdminLog, AdminLogDocument } from '../../../database/schemas/admin-log.schema';
export declare class AdminLogService {
    private adminLogModel;
    constructor(adminLogModel: Model<AdminLogDocument>);
    logAction(adminId: string, action: string, module: string, targetId?: string, details?: any, ip?: string, userAgent?: string): Promise<import("mongoose").Document<unknown, {}, AdminLogDocument, {}, import("mongoose").DefaultSchemaOptions> & AdminLog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAdminLogs(filters: any, paginationQuery: any): Promise<import("../../../common/helpers/pagination.helper").PaginationResult<unknown>>;
}
