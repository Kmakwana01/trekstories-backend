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
exports.AdminCouponsController = exports.CouponsController = void 0;
const common_1 = require("@nestjs/common");
const coupons_service_1 = require("./coupons.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const coupon_dto_1 = require("./dto/coupon.dto");
const admin_log_service_1 = require("../admin/services/admin-log.service");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
let CouponsController = class CouponsController {
    couponsService;
    constructor(couponsService) {
        this.couponsService = couponsService;
    }
    async validate(dto, user) {
        return this.couponsService.validateCoupon(dto.code, user._id, dto.tourId, dto.orderAmount);
    }
};
exports.CouponsController = CouponsController;
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_dto_1.ValidateCouponDto, Object]),
    __metadata("design:returntype", Promise)
], CouponsController.prototype, "validate", null);
exports.CouponsController = CouponsController = __decorate([
    (0, common_1.Controller)('coupons'),
    __metadata("design:paramtypes", [coupons_service_1.CouponsService])
], CouponsController);
let AdminCouponsController = class AdminCouponsController {
    couponsService;
    adminLogService;
    constructor(couponsService, adminLogService) {
        this.couponsService = couponsService;
        this.adminLogService = adminLogService;
    }
    async create(dto, adminId, req) {
        const coupon = await this.couponsService.create(dto);
        await this.adminLogService.logAction(adminId, 'CREATE_COUPON', 'Coupons', coupon._id?.toString(), { code: dto.code }, req.ip, req.headers['user-agent']);
        return coupon;
    }
    async findAll(query) {
        const { page, limit, sort, order, search, ...filters } = query;
        return this.couponsService.findAll(filters, query);
    }
    async findOne(id) {
        return this.couponsService.findOne(id);
    }
    async update(id, dto, adminId, req) {
        const coupon = await this.couponsService.update(id, dto);
        await this.adminLogService.logAction(adminId, 'UPDATE_COUPON', 'Coupons', id, { fields: Object.keys(dto) }, req.ip, req.headers['user-agent']);
        return coupon;
    }
    async remove(id, adminId, req) {
        await this.couponsService.remove(id);
        await this.adminLogService.logAction(adminId, 'DELETE_COUPON', 'Coupons', id, {}, req.ip, req.headers['user-agent']);
        return { message: 'Coupon deleted successfully' };
    }
    async getUsage(id, query) {
        return this.couponsService.getCouponUsage(id, query);
    }
};
exports.AdminCouponsController = AdminCouponsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_dto_1.CreateCouponDto, String, Object]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_helper_1.PaginationQuery]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, coupon_dto_1.UpdateCouponDto, String, Object]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/usage'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminCouponsController.prototype, "getUsage", null);
exports.AdminCouponsController = AdminCouponsController = __decorate([
    (0, common_1.Controller)('admin/coupons'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [coupons_service_1.CouponsService,
        admin_log_service_1.AdminLogService])
], AdminCouponsController);
//# sourceMappingURL=coupons.controller.js.map