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
exports.AdminBookingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const bookings_service_1 = require("./bookings.service");
const admin_log_service_1 = require("../admin/services/admin-log.service");
const transactions_service_1 = require("../transactions/transactions.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AdminBookingsController = class AdminBookingsController {
    bookingsService;
    adminLogService;
    transactionsService;
    constructor(bookingsService, adminLogService, transactionsService) {
        this.bookingsService = bookingsService;
        this.adminLogService = adminLogService;
        this.transactionsService = transactionsService;
    }
    async getPaymentHistory(id) {
        return this.transactionsService.getMyBookingPaymentHistory(id);
    }
    async getAllBookings(filters) {
        return this.bookingsService.adminGetAllBookings(filters);
    }
    async getBookingById(id) {
        const booking = await this.bookingsService.getBookingById(id);
        const paymentHistory = await this.transactionsService.getMyBookingPaymentHistory(id);
        return {
            ...booking,
            paymentSummary: paymentHistory,
        };
    }
    async updateStatus(id, status, internalNotes, adminId, req) {
        const booking = await this.bookingsService.adminUpdateStatus(id, status, internalNotes, adminId);
        await this.adminLogService.logAction(adminId, 'UPDATE_BOOKING_STATUS', 'Bookings', id, { status, internalNotes }, req.ip, req.headers['user-agent']);
        return booking;
    }
    async confirmBooking(id, adminId, req) {
        const booking = await this.bookingsService.adminConfirmBooking(id);
        await this.adminLogService.logAction(adminId, 'CONFIRM_BOOKING', 'Bookings', id, {}, req.ip, req.headers['user-agent']);
        return booking;
    }
    async cancelBooking(id, adminId, req) {
        const booking = await this.bookingsService.adminCancelBooking(id);
        await this.adminLogService.logAction(adminId, 'CANCEL_BOOKING', 'Bookings', id, {}, req.ip, req.headers['user-agent']);
        return booking;
    }
    async verifyReceipt(id, approve, adminId, req) {
        const booking = await this.bookingsService.adminVerifyReceipt(id, approve, adminId);
        await this.adminLogService.logAction(adminId, approve ? 'APPROVE_RECEIPT' : 'REJECT_RECEIPT', 'Bookings', id, { approve }, req.ip, req.headers['user-agent']);
        return booking;
    }
    async addPayment(id, amount, adminId, req) {
        const booking = await this.bookingsService.adminUpdatePaidAmount(id, amount);
        await this.adminLogService.logAction(adminId, 'ADD_PAYMENT', 'Bookings', id, { amount }, req.ip, req.headers['user-agent']);
        return booking;
    }
};
exports.AdminBookingsController = AdminBookingsController;
__decorate([
    (0, common_1.Get)(':id/payment-history'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "getPaymentHistory", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "getAllBookings", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Body)('internalNotes')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/confirm'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "confirmBooking", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Patch)(':id/verify-receipt'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('approve')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String, Object]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "verifyReceipt", null);
__decorate([
    (0, common_1.Patch)(':id/add-payment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], AdminBookingsController.prototype, "addPayment", null);
exports.AdminBookingsController = AdminBookingsController = __decorate([
    (0, common_1.Controller)('admin/bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService,
        admin_log_service_1.AdminLogService,
        transactions_service_1.TransactionsService])
], AdminBookingsController);
//# sourceMappingURL=admin-bookings.controller.js.map