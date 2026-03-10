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
exports.RefundsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../../database/schemas/booking.schema");
const transaction_schema_1 = require("../../database/schemas/transaction.schema");
const notifications_service_1 = require("../notifications/notifications.service");
const booking_status_enum_1 = require("../../common/enums/booking-status.enum");
const transaction_enum_1 = require("../../common/enums/transaction.enum");
const notification_type_enum_1 = require("../../common/enums/notification-type.enum");
let RefundsService = class RefundsService {
    bookingModel;
    transactionModel;
    notificationsService;
    constructor(bookingModel, transactionModel, notificationsService) {
        this.bookingModel = bookingModel;
        this.transactionModel = transactionModel;
        this.notificationsService = notificationsService;
    }
    async requestRefund(userId, bookingId, reason) {
        const booking = await this.bookingModel.findOne({
            _id: new mongoose_2.Types.ObjectId(bookingId),
            user: new mongoose_2.Types.ObjectId(userId)
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status !== booking_status_enum_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Refund can only be requested for cancelled bookings');
        }
        if (booking.paidAmount <= 0) {
            throw new common_1.BadRequestException('No amount paid to refund');
        }
        if (booking.refundStatus !== booking_status_enum_1.RefundStatus.NONE) {
            throw new common_1.BadRequestException('Refund request already exists');
        }
        booking.refundStatus = booking_status_enum_1.RefundStatus.REQUESTED;
        booking.refundReason = reason;
        booking.refundRequestedAt = new Date();
        await booking.save();
        await this.notificationsService.createNotification(userId, notification_type_enum_1.NotificationType.REFUND_REQUESTED, 'Refund Requested', `Your refund request for booking ${booking.bookingNumber} has been submitted.`);
        return { message: 'Refund requested successfully', booking };
    }
    async adminApproveRefund(adminId, bookingId, refundAmount, refundAdminNote) {
        const booking = await this.bookingModel.findById(bookingId).populate('user');
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.refundStatus !== booking_status_enum_1.RefundStatus.REQUESTED) {
            throw new common_1.BadRequestException('No active refund request to approve');
        }
        if (refundAmount > booking.paidAmount) {
            throw new common_1.BadRequestException('Refund amount cannot specify more than the paid amount');
        }
        booking.refundStatus = booking_status_enum_1.RefundStatus.APPROVED;
        booking.refundAmount = refundAmount;
        booking.refundAdminNote = refundAdminNote;
        await booking.save();
        await this.transactionModel.create({
            user: booking.user,
            booking: booking._id,
            type: transaction_enum_1.TransactionType.REFUND,
            amount: refundAmount,
            status: transaction_enum_1.TransactionStatus.PENDING,
            description: `Refund approved for booking ${booking.bookingNumber}${refundAdminNote ? `. Note: ${refundAdminNote}` : ''}`,
            processedBy: new mongoose_2.Types.ObjectId(adminId),
            processedAt: new Date()
        });
        const userObj = booking.user;
        const msg = `Your refund of ₹${refundAmount} for booking ${booking.bookingNumber} has been approved. ${refundAdminNote ? `Note: ${refundAdminNote}` : ''}`;
        await this.notificationsService.createNotification(userObj._id.toString(), notification_type_enum_1.NotificationType.REFUND_APPROVED, 'Refund Approved', msg);
        return { message: 'Refund approved successfully', booking };
    }
    async adminRejectRefund(adminId, bookingId, reason) {
        const booking = await this.bookingModel.findById(bookingId).populate('user');
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.refundStatus !== booking_status_enum_1.RefundStatus.REQUESTED) {
            throw new common_1.BadRequestException('No active refund request to reject');
        }
        booking.refundStatus = booking_status_enum_1.RefundStatus.REJECTED;
        booking.internalNotes.push({
            note: `Refund rejected: ${reason}`,
            createdAt: new Date(),
            adminId: new mongoose_2.Types.ObjectId(adminId)
        });
        await booking.save();
        const userObj = booking.user;
        const msg = `Your refund request for booking ${booking.bookingNumber} was rejected. Reason: ${reason}`;
        await this.notificationsService.createNotification(userObj._id.toString(), notification_type_enum_1.NotificationType.REFUND_REJECTED, 'Refund Rejected', msg);
        return { message: 'Refund rejected successfully', booking };
    }
    async markRefundProcessed(adminId, bookingId) {
        const booking = await this.bookingModel.findById(bookingId).populate('user');
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.refundStatus !== booking_status_enum_1.RefundStatus.APPROVED) {
            throw new common_1.BadRequestException('Refund must be APPROVED before it can be marked as PROCESSED');
        }
        booking.refundStatus = booking_status_enum_1.RefundStatus.PROCESSED;
        booking.refundProcessedAt = new Date();
        await booking.save();
        await this.transactionModel.updateMany({ booking: booking._id, type: transaction_enum_1.TransactionType.REFUND, status: transaction_enum_1.TransactionStatus.PENDING }, { $set: { status: transaction_enum_1.TransactionStatus.SUCCESS, processedAt: new Date(), processedBy: new mongoose_2.Types.ObjectId(adminId) } });
        const userObj = booking.user;
        const msg = `Your refund of ₹${booking.refundAmount} for booking ${booking.bookingNumber} has been processed.`;
        await this.notificationsService.createNotification(userObj._id.toString(), notification_type_enum_1.NotificationType.REFUND_PROCESSED, 'Refund Processed', msg);
        return { message: 'Refund marked as processed', booking };
    }
    async getRefundRequests(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (query.status) {
            filter.refundStatus = query.status;
        }
        else {
            filter.refundStatus = { $in: [booking_status_enum_1.RefundStatus.REQUESTED, booking_status_enum_1.RefundStatus.APPROVED, booking_status_enum_1.RefundStatus.REJECTED, booking_status_enum_1.RefundStatus.PROCESSED] };
        }
        const items = await this.bookingModel.find(filter)
            .populate('user', 'name email phone avatar')
            .populate('tour', 'title')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await this.bookingModel.countDocuments(filter);
        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }
};
exports.RefundsService = RefundsService;
exports.RefundsService = RefundsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], RefundsService);
//# sourceMappingURL=refunds.service.js.map