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
var TransactionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("../../database/schemas/transaction.schema");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
const bookings_service_1 = require("../bookings/bookings.service");
const notifications_service_1 = require("../notifications/notifications.service");
const booking_status_enum_1 = require("../../common/enums/booking-status.enum");
const transaction_enum_1 = require("../../common/enums/transaction.enum");
const notification_type_enum_1 = require("../../common/enums/notification-type.enum");
let TransactionsService = TransactionsService_1 = class TransactionsService {
    transactionModel;
    bookingsService;
    notificationsService;
    logger = new common_1.Logger(TransactionsService_1.name);
    constructor(transactionModel, bookingsService, notificationsService) {
        this.transactionModel = transactionModel;
        this.bookingsService = bookingsService;
        this.notificationsService = notificationsService;
    }
    async createTransaction(dto) {
        const transaction = new this.transactionModel(dto);
        return transaction.save();
    }
    async getUserTransactions(userId) {
        return this.transactionModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .exec();
    }
    async getTransactionById(id, userId) {
        const query = { _id: id };
        if (userId)
            query.user = userId;
        return this.transactionModel.findOne(query).exec();
    }
    async getAllTransactions(filters = {}, paginationQuery = {}) {
        const query = { ...filters };
        return (0, pagination_helper_1.paginate)(this.transactionModel, query, paginationQuery, ['user', 'booking']);
    }
    async exportToCSV(filters = {}) {
        const result = await this.getAllTransactions(filters, { limit: 1000 });
        const transactions = result.items;
        const header = 'Date,Transaction ID,User,Type,Amount,Status,Method,Description\n';
        const rows = transactions.map(t => {
            const userEmail = t.user?.email || 'Unknown';
            const bookingNum = t.booking?.bookingNumber || 'N/A';
            return `${t.createdAt.toISOString()},${t.transactionId},${userEmail},[${bookingNum}],${t.type},${t.amount},${t.status},${t.paymentMethod},${t.description || ''}`;
        }).join('\n');
        return Buffer.from(header + rows);
    }
    async submitPaymentProof(userId, dto) {
        this.logger.log(`User ${userId} submitting payment proof for booking ${dto.bookingId}`);
        const { bookingId, transactionId, paymentMethod, receiptImage, paymentAmount } = dto;
        const booking = await this.bookingsService.getBookingById(bookingId, userId);
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status === booking_status_enum_1.BookingStatus.CANCELLED || booking.status === booking_status_enum_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException(`Cannot submit payment for booking in ${booking.status} status`);
        }
        const existingPending = await this.transactionModel.findOne({
            booking: booking._id,
            type: transaction_enum_1.TransactionType.ONLINE_RECEIPT,
            status: transaction_enum_1.TransactionStatus.PENDING,
        });
        if (existingPending) {
            throw new common_1.BadRequestException('A payment proof is already under review for this booking');
        }
        const amount = paymentAmount || booking.totalAmount;
        const transaction = new this.transactionModel({
            user: userId,
            booking: bookingId,
            amount: amount,
            type: transaction_enum_1.TransactionType.ONLINE_RECEIPT,
            status: transaction_enum_1.TransactionStatus.PENDING,
            transactionId,
            paymentMethod,
            receiptImage,
            description: 'Online payment receipt submitted for review'
        });
        await transaction.save();
        await this.bookingsService.syncBookingReceiptInfo(bookingId, receiptImage, transactionId);
        this.logger.log(`Payment proof submitted successfully for booking ${bookingId}`);
        return transaction;
    }
    async approvePayment(transactionId, adminId) {
        this.logger.log(`Admin ${adminId} approving transaction: ${transactionId}`);
        const transaction = await this.transactionModel.findById(transactionId)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (transaction.status !== transaction_enum_1.TransactionStatus.PENDING) {
            throw new common_1.BadRequestException(`Transaction is in ${transaction.status} status`);
        }
        transaction.status = transaction_enum_1.TransactionStatus.SUCCESS;
        transaction.processedBy = adminId;
        transaction.processedAt = new Date();
        transaction.description = 'Online payment approved';
        await transaction.save();
        const bookingId = transaction.booking._id.toString();
        await this.bookingsService.markPaymentVerified(bookingId);
        await this.bookingsService.adminUpdatePaidAmount(bookingId, transaction.amount);
        await this.bookingsService.adminUpdatePaymentTypeAndNote(bookingId, booking_status_enum_1.PaymentType.ONLINE, 'Online payment approved', adminId);
        const currentBooking = await this.bookingsService.getBookingById(bookingId);
        if (currentBooking.status === booking_status_enum_1.BookingStatus.PENDING) {
            await this.bookingsService.adminConfirmBooking(bookingId);
        }
        const booking = await this.bookingsService.getBookingById(bookingId);
        await this.notificationsService.createNotification(transaction.user._id.toString(), notification_type_enum_1.NotificationType.PAYMENT_SUCCESS, 'Payment Approved', `Your payment for booking ${booking.bookingNumber} has been approved.`, { bookingId: transaction.booking._id, transactionId: transaction._id });
        await this.notificationsService.sendEmail(booking.user.email, 'Payment Approved', 'payment_approved', {
            name: booking.user.name,
            bookingNumber: booking.bookingNumber,
            tourTitle: booking.tour.title,
            amount: transaction.amount
        });
        this.logger.log(`Transaction ${transactionId} approved successfully.`);
        return transaction;
    }
    async rejectPayment(transactionId, adminId, reason) {
        this.logger.log(`Admin ${adminId} rejecting transaction: ${transactionId}. Reason: ${reason}`);
        const transaction = await this.transactionModel.findById(transactionId)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();
        if (!transaction)
            throw new common_1.NotFoundException('Transaction not found');
        if (transaction.status !== transaction_enum_1.TransactionStatus.PENDING) {
            throw new common_1.BadRequestException(`Transaction is in ${transaction.status} status`);
        }
        transaction.status = transaction_enum_1.TransactionStatus.FAILED;
        transaction.processedBy = adminId;
        transaction.processedAt = new Date();
        transaction.rejectionReason = reason;
        await transaction.save();
        const bookingId = transaction.booking._id.toString();
        await this.bookingsService.adminVerifyReceipt(bookingId, false, adminId);
        try {
            const uId = transaction.user._id.toString();
            await this.notificationsService.createNotification(uId, notification_type_enum_1.NotificationType.PAYMENT_FAILED, 'Payment Rejected', `Your payment for booking ${transaction.booking.bookingNumber} was rejected. Reason: ${reason}`, { bookingId: transaction.booking._id, transactionId: transaction._id });
            if (transaction.user.email) {
                await this.notificationsService.sendEmail(transaction.user.email, 'Payment Rejected', 'payment_rejected', {
                    name: transaction.user.name,
                    bookingNumber: transaction.booking.bookingNumber,
                    tourTitle: transaction.booking.tour.title,
                    amount: transaction.amount,
                    reason: reason
                });
            }
        }
        catch (err) {
            this.logger.error(`Failed to dispatch payment rejection notification for transaction ${transactionId}`, err.stack);
        }
        return transaction;
    }
    async recordOfflinePayment(adminId, dto) {
        this.logger.log(`Admin ${adminId} recording offline payment for booking ${dto.bookingId}`);
        const { bookingId, amount, paymentMethod, receiptNumber, collectedAt, notes } = dto;
        const booking = await this.bookingsService.getBookingById(bookingId);
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const transaction = new this.transactionModel({
            user: booking.user,
            booking: booking._id,
            amount,
            type: transaction_enum_1.TransactionType.OFFLINE_PAYMENT,
            status: transaction_enum_1.TransactionStatus.SUCCESS,
            transactionId: receiptNumber || `OFFLINE-${Date.now()}`,
            paymentMethod: paymentMethod || 'CASH',
            processedBy: adminId,
            processedAt: collectedAt || new Date(),
            description: `Offline payment recorded (${notes || ''})`
        });
        await transaction.save();
        await this.bookingsService.adminUpdatePaidAmount(booking._id.toString(), amount);
        await this.bookingsService.adminUpdatePaymentTypeAndNote(bookingId, booking_status_enum_1.PaymentType.OFFLINE, notes, adminId);
        const updatedBooking = await this.bookingsService.getBookingById(bookingId);
        if (updatedBooking.status === booking_status_enum_1.BookingStatus.PENDING) {
            await this.bookingsService.adminConfirmBooking(bookingId);
        }
        const populatedTrans = await this.transactionModel.findById(transaction._id)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();
        if (populatedTrans && populatedTrans.user) {
            try {
                const uId = populatedTrans.user._id.toString();
                await this.notificationsService.createNotification(uId, notification_type_enum_1.NotificationType.PAYMENT_SUCCESS, 'Offline Payment Received', `₹${amount} additional payment received. Remaining: ₹${updatedBooking.pendingAmount}`, { bookingId: populatedTrans.booking._id, transactionId: populatedTrans._id });
                if (populatedTrans.user.email) {
                    await this.notificationsService.sendEmail(populatedTrans.user.email, 'Offline Payment Received', 'payment_approved', {
                        name: populatedTrans.user.name,
                        bookingNumber: populatedTrans.booking.bookingNumber,
                        tourTitle: populatedTrans.booking.tour.title,
                        amount: populatedTrans.amount
                    });
                }
            }
            catch (err) {
                this.logger.error(`Failed to dispatch offline payment notification for transaction ${transaction._id}`, err.stack);
            }
        }
        this.logger.log(`Offline payment recorded successfully: ${transaction._id}`);
        return transaction;
    }
    async getMyBookingPaymentHistory(bookingId, userId) {
        const booking = await this.bookingsService.getBookingById(bookingId, userId);
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const transactions = await this.transactionModel.find({
            booking: bookingId,
            type: { $in: [transaction_enum_1.TransactionType.ONLINE_RECEIPT, transaction_enum_1.TransactionType.OFFLINE_PAYMENT] },
            status: { $in: [transaction_enum_1.TransactionStatus.SUCCESS, transaction_enum_1.TransactionStatus.PENDING, transaction_enum_1.TransactionStatus.FAILED] }
        })
            .populate('processedBy', 'name')
            .sort({ createdAt: -1 })
            .exec();
        return {
            totalAmount: booking.totalAmount,
            paidAmount: booking.paidAmount,
            pendingAmount: booking.pendingAmount,
            paymentType: booking.paymentType,
            payments: transactions
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = TransactionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        bookings_service_1.BookingsService,
        notifications_service_1.NotificationsService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map