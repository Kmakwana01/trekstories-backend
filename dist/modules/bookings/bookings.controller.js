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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const bookings_service_1 = require("./bookings.service");
const transactions_service_1 = require("../transactions/transactions.service");
const preview_booking_dto_1 = require("./dto/preview-booking.dto");
const create_booking_dto_1 = require("./dto/create-booking.dto");
let BookingsController = class BookingsController {
    bookingsService;
    transactionsService;
    constructor(bookingsService, transactionsService) {
        this.bookingsService = bookingsService;
        this.transactionsService = transactionsService;
    }
    async preview(dto) {
        return this.bookingsService.previewBooking(dto);
    }
    async create(userId, dto) {
        return this.bookingsService.createBooking(userId, dto);
    }
    async getMyBookings(userId) {
        return this.bookingsService.getMyBookings(userId);
    }
    async getBookingById(userId, id) {
        const booking = await this.bookingsService.getBookingById(id, userId);
        const paymentSummary = await this.transactionsService.getMyBookingPaymentHistory(id, userId);
        return {
            ...(booking.toObject?.() || booking),
            paymentSummary,
        };
    }
    async cancelBooking(userId, id) {
        return this.bookingsService.cancelBooking(id, userId);
    }
    async getPaymentSummary(userId, id) {
        const booking = await this.bookingsService.getBookingById(id, userId);
        return {
            totalAmount: booking.totalAmount,
            paidAmount: booking.paidAmount,
            pendingAmount: booking.pendingAmount,
            paymentType: booking.paymentType,
        };
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)('preview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [preview_booking_dto_1.PreviewBookingDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-bookings'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Delete)(':id/cancel'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Get)(':id/payment-summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getPaymentSummary", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService,
        transactions_service_1.TransactionsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map