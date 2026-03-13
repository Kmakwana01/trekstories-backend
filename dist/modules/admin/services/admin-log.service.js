"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const admin_log_schema_1 = require("../../../database/schemas/admin-log.schema");
const pagination_helper_1 = require("../../../common/helpers/pagination.helper");
const date_util_1 = require("../../../utils/date.util");
let AdminLogService = class AdminLogService {
    adminLogModel;
    constructor(adminLogModel) {
        this.adminLogModel = adminLogModel;
    }
    async logAction(adminId, action, module, targetId, details, ip, userAgent) {
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
    async getAdminLogs(filters, paginationQuery) {
        const query = {};
        if (filters.admin)
            query.admin = filters.admin;
        if (filters.module)
            query.module = filters.module;
        if (filters.action)
            query.action = filters.action;
        if (filters.dateFrom || filters.dateTo) {
            query.createdAt = {};
            if (filters.dateFrom)
                query.createdAt.$gte = date_util_1.DateUtil.startOfDayIST(filters.dateFrom);
            if (filters.dateTo)
                query.createdAt.$lte = date_util_1.DateUtil.endOfDayIST(filters.dateTo);
        }
        if (!paginationQuery.order) {
            paginationQuery.order = 'desc';
        }
        return (0, pagination_helper_1.paginate)(this.adminLogModel, query, paginationQuery, ['admin']);
    }
};
exports.AdminLogService = AdminLogService;
exports.AdminLogService = AdminLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_log_schema_1.AdminLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminLogService);
//# sourceMappingURL=admin-log.service.js.map