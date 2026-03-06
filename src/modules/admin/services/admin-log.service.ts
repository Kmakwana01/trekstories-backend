import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminLog, AdminLogDocument } from '../../../database/schemas/admin-log.schema';
import { paginate } from '../../../common/helpers/pagination.helper';
import { DateUtil } from '../../../utils/date.util';

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
        userAgent?: string,
    ) {
        const log = new this.adminLogModel({
            admin: adminId,
            action,
            module,
            targetId,
            details,
            ipAddress: ip,
            userAgent,
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
            if (filters.dateFrom) query.createdAt.$gte = DateUtil.startOfDayIST(filters.dateFrom);
            if (filters.dateTo) query.createdAt.$lte = DateUtil.endOfDayIST(filters.dateTo);
        }

        // Default to latest first if no order is specified
        if (!paginationQuery.order)
        {
            paginationQuery.order = 'desc';
        }

        return paginate(this.adminLogModel, query, paginationQuery, ['admin']);
    }
}
