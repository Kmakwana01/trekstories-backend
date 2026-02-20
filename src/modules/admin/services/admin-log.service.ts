import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminLog, AdminLogDocument } from '../../../database/schemas/admin-log.schema';
import { paginate } from '../../../common/helpers/pagination.helper';

@Injectable()
export class AdminLogService {
    constructor(
        @InjectModel(AdminLog.name) private adminLogModel: Model<AdminLogDocument>,
    ) { }

    async logAction(
        adminId: string,
        action: string,
        module: string,
        targetId?: string,
        details?: any,
        ip?: string,
    ) {
        const log = new this.adminLogModel({
            admin: adminId,
            action,
            module,
            targetId,
            details,
            ip,
        });
        return log.save();
    }

    async getAdminLogs(filters: any, paginationQuery: any) {
        const query: any = {};
        if (filters.admin) query.admin = filters.admin;
        if (filters.module) query.module = filters.module;
        if (filters.action) query.action = filters.action;
        if (filters.dateFrom || filters.dateTo)
        {
            query.createdAt = {};
            if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
            if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
        }

        return paginate(this.adminLogModel, query, paginationQuery, ['admin']);
    }
}
