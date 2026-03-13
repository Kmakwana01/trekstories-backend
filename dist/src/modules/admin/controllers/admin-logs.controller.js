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
exports.AdminLogsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../../common/enums/roles.enum");
const admin_log_service_1 = require("../services/admin-log.service");
const pagination_helper_1 = require("../../../common/helpers/pagination.helper");
let AdminLogsController = class AdminLogsController {
    adminLogService;
    constructor(adminLogService) {
        this.adminLogService = adminLogService;
    }
    async getAdminLogs(pagination, admin, module, action, dateFrom, dateTo) {
        return this.adminLogService.getAdminLogs({ admin, module, action, dateFrom, dateTo }, pagination);
    }
};
exports.AdminLogsController = AdminLogsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('admin')),
    __param(2, (0, common_1.Query)('module')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_helper_1.PaginationQuery, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminLogsController.prototype, "getAdminLogs", null);
exports.AdminLogsController = AdminLogsController = __decorate([
    (0, common_1.Controller)('admin/logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [admin_log_service_1.AdminLogService])
], AdminLogsController);
//# sourceMappingURL=admin-logs.controller.js.map