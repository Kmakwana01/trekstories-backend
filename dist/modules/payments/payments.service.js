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
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
const payment_schema_1 = require("../../database/schemas/payment.schema");
const bookings_service_1 = require("../bookings/bookings.service");
const transactions_service_1 = require("../transactions/transactions.service");
const notifications_service_1 = require("../notifications/notifications.service");
const date_util_1 = require("../../utils/date.util");
const booking_status_enum_1 = require("../../common/enums/booking-status.enum");
const payment_status_enum_1 = require("../../common/enums/payment-status.enum");
const transaction_enum_1 = require("../../common/enums/transaction.enum");
const notification_type_enum_1 = require("../../common/enums/notification-type.enum");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    paymentModel;
    bookingsService;
    transactionsService;
    notificationsService;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(paymentModel, bookingsService, transactionsService, notificationsService) {
        this.paymentModel = paymentModel;
        this.bookingsService = bookingsService;
        this.transactionsService = transactionsService;
        this.notificationsService = notificationsService;
    }
    async submitPaymentProof(userId, dto) {
        this.logger.log(`Submitting payment proof for user ${userId}, booking ${dto.bookingId}`);
        const { bookingId, transactionId, paymentMethod, receiptImage } = dto;
        const booking = await this.bookingsService.getBookingById(bookingId, userId);
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status !== booking_status_enum_1.BookingStatus.PENDING && booking.status !== booking_status_enum_1.BookingStatus.ON_HOLD) {
            throw new common_1.BadRequestException('Booking is not in a payable state');
        }
        const pendingPayment = await this.paymentModel.findOne({
            booking: bookingId,
            status: payment_status_enum_1.PaymentStatus.UNDER_REVIEW,
        }).exec();
        if (pendingPayment) {
            throw new common_1.ConflictException('A payment receipt is already under review for this booking');
        }
        const existing = await this.paymentModel.findOne({ transactionId }).exec();
        if (existing)
            throw new common_1.ConflictException('Transaction ID already used');
        const payment = new this.paymentModel({
            user: userId,
            booking: bookingId,
            method: payment_status_enum_1.PaymentMethod.ONLINE,
            paymentMethod,
            transactionId,
            paymentReceiptImage: receiptImage,
            amount: booking.totalAmount,
            status: payment_status_enum_1.PaymentStatus.UNDER_REVIEW,
        });
        const savedPayment = await payment.save();
        try {
            await this.bookingsService.syncBookingReceiptInfo(bookingId, receiptImage, transactionId, booking_status_enum_1.PaymentType.ONLINE);
        }
        catch (_) { }
        try {
            await this.notificationsService.createNotification(userId, notification_type_enum_1.NotificationType.PAYMENT_UNDER_REVIEW, 'Receipt Submitted', `Your payment receipt for booking ${booking.bookingNumber} has been submitted and is under review.`, { bookingId, paymentId: savedPayment._id });
        }
        catch (_) { }
        return savedPayment;
    }
    async getMyPayments(userId) {
        return this.paymentModel.find({ user: userId }).sort({ createdAt: -1 }).populate('booking', 'bookingNumber').exec();
    }
    async getPaymentById(id) {
        return this.paymentModel.findById(id).populate('user', 'name email').populate('booking').exec();
    }
    async getPendingPayments(paginationQuery) {
        return (0, pagination_helper_1.paginate)(this.paymentModel, { status: payment_status_enum_1.PaymentStatus.UNDER_REVIEW }, paginationQuery, ['user', 'booking']);
    }
    async approvePayment(paymentId, adminId) {
        this.logger.log(`Admin ${adminId} approving payment: ${paymentId}`);
        const payment = await this.paymentModel.findById(paymentId).exec();
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        if (payment.status !== payment_status_enum_1.PaymentStatus.UNDER_REVIEW)
            throw new common_1.BadRequestException('Payment not under review');
        payment.status = payment_status_enum_1.PaymentStatus.SUCCESS;
        payment.verifiedBy = adminId;
        payment.verifiedAt = date_util_1.DateUtil.nowUTC();
        payment.paidAt = date_util_1.DateUtil.nowUTC();
        await payment.save();
        await this.bookingsService.adminUpdatePaidAmount(payment.booking.toString(), payment.amount);
        await this.bookingsService.syncBookingReceiptInfo(payment.booking.toString(), payment.paymentReceiptImage || '', payment.transactionId || '', booking_status_enum_1.PaymentType.ONLINE);
        await this.bookingsService.markPaymentVerified(payment.booking.toString());
        await this.bookingsService.adminConfirmBooking(payment.booking.toString());
        await this.transactionsService.createTransaction({
            user: payment.user,
            booking: payment.booking,
            payment: payment._id,
            type: transaction_enum_1.TransactionType.PAYMENT,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId,
            status: transaction_enum_1.TransactionStatus.SUCCESS,
            processedBy: adminId,
            processedAt: date_util_1.DateUtil.nowUTC(),
            description: 'Online payment approved'
        });
        const booking = await this.bookingsService.getBookingById(payment.booking.toString());
        await this.notificationsService.createNotification(payment.user.toString(), notification_type_enum_1.NotificationType.PAYMENT_SUCCESS, 'Payment Approved', `Your payment for booking ${booking.bookingNumber} has been approved. Your booking is now confirmed!`, { bookingId: payment.booking, paymentId: payment._id });
        await this.notificationsService.sendEmail(booking.user.email, 'Payment Approved', 'payment_approved', {
            name: booking.user.name,
            bookingNumber: booking.bookingNumber,
            tourTitle: booking.tour.title,
            amount: payment.amount
        });
        this.logger.log(`Payment ${paymentId} approved successfully and booking confirmed.`);
        return payment;
    }
    async rejectPayment(paymentId, adminId, reason) {
        this.logger.log(`Admin ${adminId} rejecting payment: ${paymentId}. Reason: ${reason}`);
        const payment = await this.paymentModel.findById(paymentId)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        payment.status = payment_status_enum_1.PaymentStatus.REJECTED;
        payment.verifiedBy = adminId;
        payment.verifiedAt = date_util_1.DateUtil.nowUTC();
        payment.rejectionReason = reason;
        const savedPayment = await payment.save();
        try {
            const uId = payment.user?._id?.toString() || payment.user?.toString();
            if (uId) {
                await this.notificationsService.createNotification(uId, notification_type_enum_1.NotificationType.PAYMENT_FAILED, 'Payment Rejected', `Your payment for booking ${payment.booking.bookingNumber} was rejected. Reason: ${reason}`, { bookingId: payment.booking, paymentId: payment._id });
                if (payment.user.email) {
                    await this.notificationsService.sendEmail(payment.user.email, 'Payment Rejected', 'payment_rejected', {
                        name: payment.user.name,
                        bookingNumber: payment.booking.bookingNumber,
                        tourTitle: payment.booking.tour.title,
                        amount: payment.amount,
                        reason: reason
                    });
                }
            }
        }
        catch (err) {
            this.logger.error(`Failed to dispatch payment rejection notification for payment ${paymentId}`, err.stack);
        }
        return savedPayment;
    }
    async recordOfflinePayment(adminId, dto) {
        this.logger.log(`Admin ${adminId} recording offline payment for booking ${dto.bookingId}`);
        const { bookingId, amount, paymentMethod, receiptNumber, collectedAt, notes } = dto;
        const booking = await this.bookingsService.getBookingById(bookingId);
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const payment = new this.paymentModel({
            user: booking.user,
            booking: booking._id,
            method: payment_status_enum_1.PaymentMethod.OFFLINE,
            paymentMethod,
            offlineReceiptNumber: receiptNumber,
            offlineCollectedBy: adminId,
            offlineCollectedAt: collectedAt || date_util_1.DateUtil.nowUTC(),
            amount,
            status: payment_status_enum_1.PaymentStatus.SUCCESS,
            paidAt: collectedAt || date_util_1.DateUtil.nowUTC(),
            metadata: { notes }
        });
        await payment.save();
        await this.bookingsService.adminUpdatePaidAmount(booking._id.toString(), amount);
        const updatedBooking = await this.bookingsService.getBookingById(bookingId);
        if (updatedBooking.status === booking_status_enum_1.BookingStatus.PENDING) {
            if (updatedBooking.pendingAmount <= 0) {
                await this.bookingsService.adminConfirmBooking(bookingId);
            }
            else {
                await this.bookingsService.adminUpdateStatus(bookingId, booking_status_enum_1.BookingStatus.ON_HOLD, 'Partial payment recorded');
            }
        }
        else if (updatedBooking.status === booking_status_enum_1.BookingStatus.ON_HOLD && updatedBooking.pendingAmount <= 0) {
            await this.bookingsService.adminConfirmBooking(bookingId);
        }
        await this.transactionsService.createTransaction({
            user: booking.user,
            booking: booking._id,
            payment: payment._id,
            type: transaction_enum_1.TransactionType.PAYMENT,
            amount,
            paymentMethod,
            status: transaction_enum_1.TransactionStatus.SUCCESS,
            processedBy: adminId,
            processedAt: date_util_1.DateUtil.nowUTC(),
            description: `Offline payment recorded (${notes || ''})`
        });
        const savedPayment = await payment.save();
        const populatedPayment = await this.paymentModel.findById(payment._id)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();
        if (populatedPayment && populatedPayment.user) {
            try {
                const uId = populatedPayment.user?._id?.toString() || populatedPayment.user?.toString();
                if (uId) {
                    await this.notificationsService.createNotification(uId, notification_type_enum_1.NotificationType.PAYMENT_SUCCESS, 'Offline Payment Received', `We have successfully received your offline payment of ${amount} for booking ${populatedPayment.booking.bookingNumber}.`, { bookingId: populatedPayment.booking, paymentId: populatedPayment._id });
                    if (populatedPayment.user.email) {
                        await this.notificationsService.sendEmail(populatedPayment.user.email, 'Offline Payment Received', 'payment_approved', {
                            name: populatedPayment.user.name,
                            bookingNumber: populatedPayment.booking.bookingNumber,
                            tourTitle: populatedPayment.booking.tour.title,
                            amount: populatedPayment.amount
                        });
                    }
                }
            }
            catch (err) {
                this.logger.error(`Failed to dispatch offline payment notification for payment ${payment._id}`, err.stack);
            }
        }
        this.logger.log(`Offline payment recorded successfully: ${savedPayment._id}`);
        return savedPayment;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        bookings_service_1.BookingsService,
        transactions_service_1.TransactionsService,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map