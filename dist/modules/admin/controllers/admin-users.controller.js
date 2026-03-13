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
exports.AdminUsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../../common/enums/roles.enum");
const admin_crm_service_1 = require("../services/admin-crm.service");
const admin_log_service_1 = require("../services/admin-log.service");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const pagination_helper_1 = require("../../../common/helpers/pagination.helper");
let AdminUsersController = class AdminUsersController {
    crmService;
    adminLogService;
    constructor(crmService, adminLogService) {
        this.crmService = crmService;
        this.adminLogService = adminLogService;
    }
    async getAllUsers(pagination, search, isVerified, isBlocked) {
        return this.crmService.getAllUsers({ search, isVerified, isBlocked }, pagination);
    }
    async getUserById(id) {
        return this.crmService.getUserById(id);
    }
    async blockUser(id, reason, admin, req) {
        const result = await this.crmService.blockUser(id, admin._id.toString(), reason, req.ip, req.headers['user-agent']);
        return result;
    }
    async unblockUser(id, admin, req) {
        const result = await this.crmService.unblockUser(id, admin._id.toString(), req.ip, req.headers['user-agent']);
        return result;
    }
    async addUserNote(id, note, admin, req) {
        const result = await this.crmService.addUserNote(id, note);
        await this.adminLogService.logAction(admin._id.toString(), 'ADD_USER_NOTE', 'Users', id, { note }, req.ip, req.headers['user-agent']);
        return result;
    }
};
exports.AdminUsersController = AdminUsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('isVerified')),
    __param(3, (0, common_1.Query)('isBlocked')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_helper_1.PaginationQuery, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Patch)(':id/block'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Patch)(':id/unblock'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.Post)(':id/notes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('note')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminUsersController.prototype, "addUserNote", null);
exports.AdminUsersController = AdminUsersController = __decorate([
    (0, common_1.Controller)('admin/users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [admin_crm_service_1.AdminCrmService,
        admin_log_service_1.AdminLogService])
], AdminUsersController);
//# sourceMappingURL=admin-users.controller.js.map