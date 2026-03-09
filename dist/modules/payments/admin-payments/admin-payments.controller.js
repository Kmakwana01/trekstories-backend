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
exports.AdminPaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("../payments.service");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
const roles_enum_1 = require("../../../common/enums/roles.enum");
const admin_log_service_1 = require("../../admin/services/admin-log.service");
const pagination_helper_1 = require("../../../common/helpers/pagination.helper");
let AdminPaymentsController = class AdminPaymentsController {
    paymentsService;
    adminLogService;
    constructor(paymentsService, adminLogService) {
        this.paymentsService = paymentsService;
        this.adminLogService = adminLogService;
    }
    async getPendingPayments(query) {
        return this.paymentsService.getPendingPayments(query);
    }
    async approvePayment(id, adminId, req) {
        const payment = await this.paymentsService.approvePayment(id, adminId);
        await this.adminLogService.logAction(adminId, 'APPROVE_PAYMENT', 'Payments', id, { amount: payment.amount }, req.ip, req.headers['user-agent']);
        return payment;
    }
    async rejectPayment(id, adminId, reason, req) {
        const payment = await this.paymentsService.rejectPayment(id, adminId, reason);
        await this.adminLogService.logAction(adminId, 'REJECT_PAYMENT', 'Payments', id, { reason }, req.ip, req.headers['user-agent']);
        return payment;
    }
    async recordOfflinePayment(adminId, dto, req) {
        const payment = await this.paymentsService.recordOfflinePayment(adminId, dto);
        await this.adminLogService.logAction(adminId, 'RECORD_OFFLINE_PAYMENT', 'Payments', dto.bookingId, { amount: dto.amount, method: dto.paymentMethod }, req.ip, req.headers['user-agent']);
        return payment;
    }
    async getBookingPaymentHistory(bookingId) {
        return this.paymentsService.getMyBookingPaymentHistory(bookingId);
    }
};
exports.AdminPaymentsController = AdminPaymentsController;
__decorate([
    (0, common_1.Get)('pending-review'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_helper_1.PaginationQuery]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "getPendingPayments", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "approvePayment", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Body)('reason')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "rejectPayment", null);
__decorate([
    (0, common_1.Post)('offline'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "recordOfflinePayment", null);
__decorate([
    (0, common_1.Get)('history/:bookingId'),
    __param(0, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPaymentsController.prototype, "getBookingPaymentHistory", null);
exports.AdminPaymentsController = AdminPaymentsController = __decorate([
    (0, common_1.Controller)('admin/payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService,
        admin_log_service_1.AdminLogService])
], AdminPaymentsController);
//# sourceMappingURL=admin-payments.controller.js.map