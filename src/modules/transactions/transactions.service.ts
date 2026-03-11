import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../../database/schemas/transaction.schema';
import { paginate, PaginationQuery } from '../../common/helpers/pagination.helper';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingStatus, PaymentType } from '../../common/enums/booking-status.enum';
import { TransactionType, TransactionStatus } from '../../common/enums/transaction.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Injectable()
export class TransactionsService {
    private readonly logger = new Logger(TransactionsService.name);

    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
        private readonly bookingsService: BookingsService,
        private readonly notificationsService: NotificationsService
    ) { }

    async createTransaction(dto: Partial<Transaction>) {
        const transaction = new this.transactionModel(dto);
        return transaction.save();
    }

    async getUserTransactions(userId: string) {
        return this.transactionModel.find({ user: userId } as any)
            .sort({ createdAt: -1 })
            .exec();
    }

    async getTransactionById(id: string, userId?: string) {
        const query: any = { _id: id };
        if (userId) query.user = userId;
        return this.transactionModel.findOne(query).exec();
    }

    // Admin methods
    async getAllTransactions(filters: any = {}, paginationQuery: PaginationQuery = {}) {
        const query = { ...filters };
        return paginate(this.transactionModel, query, paginationQuery, ['user', 'booking']);
    }

    async exportToCSV(filters: any = {}): Promise<Buffer> {
        const result = await this.getAllTransactions(filters, { limit: 1000 }); // Export more for CSV
        const transactions = result.items as any[];
        const header = 'Date,Transaction ID,User,Type,Amount,Status,Method,Description\n';
        const rows = transactions.map(t => {
            const userEmail = (t.user as any)?.email || 'Unknown';
            const bookingNum = (t.booking as any)?.bookingNumber || 'N/A';
            return `${(t as any).createdAt.toISOString()},${t.transactionId},${userEmail},[${bookingNum}],${t.type},${t.amount},${t.status},${t.paymentMethod},${t.description || ''}`;
        }).join('\n');

        return Buffer.from(header + rows);
    }

    // -------------------------------------------------------------------------
    // Payment / Receipt Methods (Migrated from PaymentsService)
    // -------------------------------------------------------------------------

    async submitPaymentProof(userId: string, dto: any) {
        this.logger.log(`User ${userId} submitting payment proof for booking ${dto.bookingId}`);
        const { bookingId, transactionId, paymentMethod, receiptImage, paymentAmount } = dto;

        const booking = await this.bookingsService.getBookingById(bookingId, userId);
        if (!booking) throw new NotFoundException('Booking not found');

        // Allow PENDING bookings or CONFIRMED bookings with pending amounts
        if (booking.status === BookingStatus.CANCELLED || booking.status === BookingStatus.COMPLETED)
        {
            throw new BadRequestException(`Cannot submit payment for booking in ${booking.status} status`);
        }

        // Check if an existing receipt is under review
        const existingPending = await this.transactionModel.findOne({
            booking: booking._id as any,
            type: TransactionType.ONLINE_RECEIPT,
            status: TransactionStatus.PENDING,
        });

        if (existingPending)
        {
            throw new BadRequestException('A payment proof is already under review for this booking');
        }

        // Create transaction record
        const amount = paymentAmount || booking.totalAmount;
        const transaction = new this.transactionModel({
            user: userId,
            booking: bookingId,
            amount: amount,
            type: TransactionType.ONLINE_RECEIPT,
            status: TransactionStatus.PENDING,
            transactionId,
            paymentMethod,
            receiptImage,
            description: 'Online payment receipt submitted for review'
        });

        await transaction.save();

        // Update booking with latest receipt info
        await this.bookingsService.syncBookingReceiptInfo(
            bookingId,
            receiptImage,
            transactionId
        );

        this.logger.log(`Payment proof submitted successfully for booking ${bookingId}`);
        return transaction;
    }

    async approvePayment(transactionId: string, adminId: string) {
        this.logger.log(`Admin ${adminId} approving transaction: ${transactionId}`);
        const transaction = await this.transactionModel.findById(transactionId)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();

        if (!transaction) throw new NotFoundException('Transaction not found');
        if (transaction.status !== TransactionStatus.PENDING)
        {
            throw new BadRequestException(`Transaction is in ${transaction.status} status`);
        }

        // Update transaction status
        transaction.status = TransactionStatus.SUCCESS;
        transaction.processedBy = adminId as any;
        transaction.processedAt = new Date();
        transaction.description = 'Online payment approved';

        await transaction.save();

        const bookingId = (transaction.booking as any)._id.toString();

        // Mark payment as verified on booking
        await this.bookingsService.markPaymentVerified(bookingId);

        await this.bookingsService.adminUpdatePaidAmount(bookingId, transaction.amount);
        await this.bookingsService.adminUpdatePaymentTypeAndNote(bookingId, PaymentType.ONLINE, 'Online payment approved', adminId);

        // Always confirm booking if not already confirmed
        const currentBooking = await this.bookingsService.getBookingById(bookingId);
        if (currentBooking.status === BookingStatus.PENDING)
        {
            await this.bookingsService.adminConfirmBooking(bookingId);
        }

        // Send notification
        const booking = await this.bookingsService.getBookingById(bookingId);
        await this.notificationsService.createNotification(
            (transaction.user as any)._id.toString(),
            NotificationType.PAYMENT_SUCCESS,
            'Payment Approved',
            `Your payment for booking ${booking.bookingNumber} has been approved.`,
            { bookingId: (transaction.booking as any)._id, transactionId: transaction._id }
        );

        await this.notificationsService.sendEmail(
            (booking.user as any).email,
            'Payment Approved',
            'payment_approved',
            {
                name: (booking.user as any).name,
                bookingNumber: booking.bookingNumber,
                tourTitle: (booking.tour as any).title,
                amount: transaction.amount
            }
        );

        this.logger.log(`Transaction ${transactionId} approved successfully.`);
        return transaction;
    }

    async rejectPayment(transactionId: string, adminId: string, reason: string) {
        this.logger.log(`Admin ${adminId} rejecting transaction: ${transactionId}. Reason: ${reason}`);
        const transaction = await this.transactionModel.findById(transactionId)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();

        if (!transaction) throw new NotFoundException('Transaction not found');
        if (transaction.status !== TransactionStatus.PENDING)
        {
            throw new BadRequestException(`Transaction is in ${transaction.status} status`);
        }

        transaction.status = TransactionStatus.FAILED;
        transaction.processedBy = adminId as any;
        transaction.processedAt = new Date();
        transaction.rejectionReason = reason;

        await transaction.save();

        const bookingId = (transaction.booking as any)._id.toString();
        // Reset booking receipt fields so user can re-upload
        await this.bookingsService.adminVerifyReceipt(bookingId, false, adminId);

        try
        {
            const uId = (transaction.user as any)._id.toString();
            await this.notificationsService.createNotification(
                uId,
                NotificationType.PAYMENT_FAILED,
                'Payment Rejected',
                `Your payment for booking ${(transaction.booking as any).bookingNumber} was rejected. Reason: ${reason}`,
                { bookingId: (transaction.booking as any)._id, transactionId: transaction._id }
            );

            if ((transaction.user as any).email)
            {
                await this.notificationsService.sendEmail(
                    (transaction.user as any).email,
                    'Payment Rejected',
                    'payment_rejected',
                    {
                        name: (transaction.user as any).name,
                        bookingNumber: (transaction.booking as any).bookingNumber,
                        tourTitle: ((transaction.booking as any).tour as any).title,
                        amount: transaction.amount,
                        reason: reason
                    }
                );
            }
        } catch (err)
        {
            this.logger.error(`Failed to dispatch payment rejection notification for transaction ${transactionId}`, err.stack);
        }

        return transaction;
    }

    async recordOfflinePayment(adminId: string, dto: any) {
        this.logger.log(`Admin ${adminId} recording offline payment for booking ${dto.bookingId}`);
        const { bookingId, amount, paymentMethod, receiptNumber, collectedAt, notes } = dto;

        const booking = await this.bookingsService.getBookingById(bookingId);
        if (!booking) throw new NotFoundException('Booking not found');

        const transaction = new this.transactionModel({
            user: booking.user,
            booking: booking._id,
            amount,
            type: TransactionType.OFFLINE_PAYMENT,
            status: TransactionStatus.SUCCESS,
            transactionId: receiptNumber || `OFFLINE-${Date.now()}`,
            paymentMethod: paymentMethod || 'CASH',
            processedBy: adminId,
            processedAt: collectedAt || new Date(),
            description: `Offline payment recorded (${notes || ''})`
        });
        await transaction.save();

        // Update booking
        await this.bookingsService.adminUpdatePaidAmount(booking._id.toString(), amount);
        await this.bookingsService.adminUpdatePaymentTypeAndNote(bookingId, PaymentType.OFFLINE, notes, adminId);

        const updatedBooking = await this.bookingsService.getBookingById(bookingId);
        if (updatedBooking.status === BookingStatus.PENDING)
        {
            await this.bookingsService.adminConfirmBooking(bookingId);
        }

        const populatedTrans = await this.transactionModel.findById(transaction._id)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();

        // Send Notification
        if (populatedTrans && populatedTrans.user)
        {
            try
            {
                const uId = (populatedTrans.user as any)._id.toString();
                await this.notificationsService.createNotification(
                    uId,
                    NotificationType.PAYMENT_SUCCESS,
                    'Offline Payment Received',
                    `₹${amount} additional payment received. Remaining: ₹${updatedBooking.pendingAmount}`,
                    { bookingId: (populatedTrans.booking as any)._id, transactionId: populatedTrans._id }
                );

                if ((populatedTrans.user as any).email)
                {
                    await this.notificationsService.sendEmail(
                        (populatedTrans.user as any).email,
                        'Offline Payment Received',
                        'payment_approved',
                        {
                            name: (populatedTrans.user as any).name,
                            bookingNumber: (populatedTrans.booking as any).bookingNumber,
                            tourTitle: ((populatedTrans.booking as any).tour as any).title,
                            amount: populatedTrans.amount
                        }
                    );
                }
            } catch (err)
            {
                this.logger.error(`Failed to dispatch offline payment notification for transaction ${transaction._id}`, err.stack);
            }
        }

        this.logger.log(`Offline payment recorded successfully: ${transaction._id}`);
        return transaction;
    }

    async getMyBookingPaymentHistory(bookingId: string, userId?: string) {
        const booking = await this.bookingsService.getBookingById(bookingId, userId);
        if (!booking) throw new NotFoundException('Booking not found');

        const transactions = await this.transactionModel.find({
            booking: bookingId as any,
            type: { $in: [TransactionType.ONLINE_RECEIPT, TransactionType.OFFLINE_PAYMENT] },
            status: { $in: [TransactionStatus.SUCCESS, TransactionStatus.PENDING, TransactionStatus.FAILED] }
        })
            .populate('processedBy', 'name')
            .sort({ createdAt: -1 })
            .exec();

        return {
            totalAmount: booking.totalAmount,
            paidAmount: booking.paidAmount,
            pendingAmount: booking.pendingAmount,
            paymentType: booking.paymentType,
            payments: transactions // FE expects `payments` property
        };
    }
}
