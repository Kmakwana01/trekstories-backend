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
exports.AdminTeamMembersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const team_members_service_1 = require("./team-members.service");
const create_team_member_dto_1 = require("./dto/create-team-member.dto");
const update_team_member_dto_1 = require("./dto/update-team-member.dto");
const filter_team_member_dto_1 = require("./dto/filter-team-member.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const admin_log_service_1 = require("../admin/services/admin-log.service");
const imgbb_service_1 = require("../../common/services/imgbb.service");
const teamMemberMulter = {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
};
let AdminTeamMembersController = class AdminTeamMembersController {
    teamMembersService;
    adminLogService;
    imgbbService;
    constructor(teamMembersService, adminLogService, imgbbService) {
        this.teamMembersService = teamMembersService;
        this.adminLogService = adminLogService;
        this.imgbbService = imgbbService;
    }
    async create(createDto, file, user, req) {
        let imageUrl;
        if (file) {
            imageUrl = await this.imgbbService.uploadImage(file);
        }
        const member = await this.teamMembersService.create(createDto, imageUrl);
        await this.adminLogService.logAction(user._id.toString(), 'CREATE_TEAM_MEMBER', 'TeamMembers', member._id?.toString(), { name: createDto.name, designation: createDto.designation }, req.ip, req.headers['user-agent']);
        return member;
    }
    findAll(filterDto) {
        return this.teamMembersService.findAllAdmin(filterDto);
    }
    findOne(id) {
        return this.teamMembersService.findOne(id);
    }
    async update(id, updateDto, file, user, req) {
        let imageUrl;
        if (file) {
            imageUrl = await this.imgbbService.uploadImage(file);
        }
        const member = await this.teamMembersService.update(id, updateDto, imageUrl);
        await this.adminLogService.logAction(user._id.toString(), 'UPDATE_TEAM_MEMBER', 'TeamMembers', id, { fields: Object.keys(updateDto) }, req.ip, req.headers['user-agent']);
        return member;
    }
    async remove(id, user, req) {
        await this.teamMembersService.remove(id);
        await this.adminLogService.logAction(user._id.toString(), 'DELETE_TEAM_MEMBER', 'TeamMembers', id, {}, req.ip, req.headers['user-agent']);
        return { message: 'Team member deleted successfully' };
    }
    async toggleActive(id, user, req) {
        const member = await this.teamMembersService.toggleActive(id);
        await this.adminLogService.logAction(user._id.toString(), 'TOGGLE_TEAM_MEMBER_ACTIVE', 'TeamMembers', id, { isActive: member.isActive }, req.ip, req.headers['user-agent']);
        return member;
    }
};
exports.AdminTeamMembersController = AdminTeamMembersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', teamMemberMulter)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_team_member_dto_1.CreateTeamMemberDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminTeamMembersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_team_member_dto_1.FilterTeamMemberDto]),
    __metadata("design:returntype", void 0)
], AdminTeamMembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminTeamMembersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', teamMemberMulter)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_team_member_dto_1.UpdateTeamMemberDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminTeamMembersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminTeamMembersController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminTeamMembersController.prototype, "toggleActive", null);
exports.AdminTeamMembersController = AdminTeamMembersController = __decorate([
    (0, common_1.Controller)('admin/team-members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [team_members_service_1.TeamMembersService,
        admin_log_service_1.AdminLogService,
        imgbb_service_1.ImgbbService])
], AdminTeamMembersController);
//# sourceMappingURL=admin-team-members.controller.js.map