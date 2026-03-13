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
exports.AdminReviewsController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("./reviews.service");
const filter_review_dto_1 = require("./dto/filter-review.dto");
const reject_review_dto_1 = require("./dto/reject-review.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const admin_log_service_1 = require("../admin/services/admin-log.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AdminReviewsController = class AdminReviewsController {
    reviewsService;
    adminLogService;
    constructor(reviewsService, adminLogService) {
        this.reviewsService = reviewsService;
        this.adminLogService = adminLogService;
    }
    findAll(filterReviewDto) {
        return this.reviewsService.findAllAdmin(filterReviewDto);
    }
    async approve(id, adminId, req) {
        const review = await this.reviewsService.approve(id);
        await this.adminLogService.logAction(adminId, 'APPROVE_REVIEW', 'Reviews', id, {}, req.ip, req.headers['user-agent']);
        return review;
    }
    async reject(id, rejectReviewDto, adminId, req) {
        const review = await this.reviewsService.reject(id, rejectReviewDto.reason);
        await this.adminLogService.logAction(adminId, 'REJECT_REVIEW', 'Reviews', id, { reason: rejectReviewDto.reason }, req.ip, req.headers['user-agent']);
        return review;
    }
    async remove(id, adminId, req) {
        await this.reviewsService.delete(id);
        await this.adminLogService.logAction(adminId, 'DELETE_REVIEW', 'Reviews', id, {}, req.ip, req.headers['user-agent']);
        return { message: 'Review deleted successfully' };
    }
};
exports.AdminReviewsController = AdminReviewsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_review_dto_1.FilterReviewDto]),
    __metadata("design:returntype", void 0)
], AdminReviewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminReviewsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reject_review_dto_1.RejectReviewDto, String, Object]),
    __metadata("design:returntype", Promise)
], AdminReviewsController.prototype, "reject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminReviewsController.prototype, "remove", null);
exports.AdminReviewsController = AdminReviewsController = __decorate([
    (0, common_1.Controller)('admin/reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService,
        admin_log_service_1.AdminLogService])
], AdminReviewsController);
//# sourceMappingURL=admin-reviews.controller.js.map