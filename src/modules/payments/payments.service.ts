import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paginate, PaginationQuery } from '../../common/helpers/pagination.helper';
import { Payment, PaymentDocument } from '../../database/schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { NotificationsService } from '../notifications/notifications.service';
import { DateUtil } from '../../utils/date.util';
import { BookingStatus, PaymentType } from '../../common/enums/booking-status.enum';
import { PaymentStatus, PaymentMethod } from '../../common/enums/payment-status.enum';
import { TransactionType, TransactionStatus } from '../../common/enums/transaction.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);

    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
        private bookingsService: BookingsService,
        private transactionsService: TransactionsService,
        private notificationsService: NotificationsService,
    ) { }

    async submitPaymentProof(userId: string, dto: any) {
        this.logger.log(`Submitting payment proof for user ${userId}, booking ${dto.bookingId}`);
        const { bookingId, transactionId, paymentMethod, receiptImage } = dto;

        const booking = await this.bookingsService.getBookingById(bookingId, userId);
        if (!booking) throw new NotFoundException('Booking not found');

        // Allow receipt upload for PENDING and ON_HOLD (re-upload after rejection)
        if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.ON_HOLD)
        {
            throw new BadRequestException('Booking is not in a payable state');
        }

        // Block duplicate submissions — if a receipt is already UNDER_REVIEW, don't allow another
        const pendingPayment = await this.paymentModel.findOne({
            booking: bookingId,
            status: PaymentStatus.UNDER_REVIEW,
        }).exec();
        if (pendingPayment)
        {
            throw new ConflictException('A payment receipt is already under review for this booking');
        }

        // Check if transaction ID was already used
        const existing = await this.paymentModel.findOne({ transactionId }).exec();
        if (existing) throw new ConflictException('Transaction ID already used');

        const payment = new this.paymentModel({
            user: userId,
            booking: bookingId,
            method: PaymentMethod.ONLINE,
            paymentMethod,
            transactionId,
            paymentReceiptImage: receiptImage,
            amount: booking.totalAmount,
            status: PaymentStatus.UNDER_REVIEW,
        });

        const savedPayment = await payment.save();

        // ── Sync receipt info onto Booking so it appears in admin booking detail ──
        try
        {
            await this.bookingsService.syncBookingReceiptInfo(bookingId, receiptImage, transactionId, PaymentType.ONLINE);
        } catch (_) { /* non-critical — booking still has payment record */ }

        // Notify admin via user notification system
        try
        {
            await this.notificationsService.createNotification(
                userId,
                NotificationType.PAYMENT_UNDER_REVIEW,
                'Receipt Submitted',
                `Your payment receipt for booking ${booking.bookingNumber} has been submitted and is under review.`,
                { bookingId, paymentId: savedPayment._id }
            );
        } catch (_) { /* non-critical */ }

        return savedPayment;
    }

    async getMyPayments(userId: string) {
        return this.paymentModel.find({ user: userId } as any).sort({ createdAt: -1 }).populate('booking', 'bookingNumber').exec();
    }

    async getPaymentById(id: string) {
        return this.paymentModel.findById(id).populate('user', 'name email').populate('booking').exec();
    }

    // Admin methods
    async getPendingPayments(paginationQuery: PaginationQuery) {
        return paginate(
            this.paymentModel,
            { status: PaymentStatus.UNDER_REVIEW },
            paginationQuery,
            ['user', 'booking']
        );
    }

    async approvePayment(paymentId: string, adminId: string) {
        this.logger.log(`Admin ${adminId} approving payment: ${paymentId}`);
        const payment = await this.paymentModel.findById(paymentId).exec();

        if (!payment) throw new NotFoundException('Payment not found');
        if (payment.status !== PaymentStatus.UNDER_REVIEW) throw new BadRequestException('Payment not under review');

        payment.status = PaymentStatus.SUCCESS;
        payment.verifiedBy = adminId as any;
        payment.verifiedAt = DateUtil.nowUTC();
        payment.paidAt = DateUtil.nowUTC();
        await payment.save();

        // Update booking payment fields FIRST (paidAmount, pendingAmount, paymentVerifiedAt)
        await this.bookingsService.adminUpdatePaidAmount(payment.booking.toString(), payment.amount);
        await this.bookingsService.syncBookingReceiptInfo(
            payment.booking.toString(),
            payment.paymentReceiptImage || '',
            payment.transactionId || '',
            PaymentType.ONLINE
        );
        // Mark receipt as verified on the booking
        await this.bookingsService.markPaymentVerified(payment.booking.toString());

        // Then confirm booking (sets status → CONFIRMED, increments seats, sends notification)
        await this.bookingsService.adminConfirmBooking(payment.booking.toString());

        // Create transaction record
        await this.transactionsService.createTransaction({
            user: payment.user as any,
            booking: payment.booking as any,
            payment: payment._id as any,
            type: TransactionType.PAYMENT,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId,
            status: TransactionStatus.SUCCESS,
            processedBy: adminId as any,
            processedAt: DateUtil.nowUTC(),
            description: 'Online payment approved'
        });

        // Send notification
        const booking = await this.bookingsService.getBookingById(payment.booking.toString());
        await this.notificationsService.createNotification(
            payment.user.toString(),
            NotificationType.PAYMENT_SUCCESS,
            'Payment Approved',
            `Your payment for booking ${booking.bookingNumber} has been approved. Your booking is now confirmed!`,
            { bookingId: payment.booking, paymentId: payment._id }
        );

        await this.notificationsService.sendEmail(
            (booking.user as any).email,
            'Payment Approved',
            'payment_approved',
            {
                name: (booking.user as any).name,
                bookingNumber: booking.bookingNumber,
                tourTitle: (booking.tour as any).title,
                amount: payment.amount
            }
        );

        this.logger.log(`Payment ${paymentId} approved successfully and booking confirmed.`);
        return payment;
    }

    async rejectPayment(paymentId: string, adminId: string, reason: string) {
        this.logger.log(`Admin ${adminId} rejecting payment: ${paymentId}. Reason: ${reason}`);
        const payment = await this.paymentModel.findById(paymentId)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();

        if (!payment) throw new NotFoundException('Payment not found');

        payment.status = PaymentStatus.REJECTED;
        payment.verifiedBy = adminId as any;
        payment.verifiedAt = DateUtil.nowUTC();
        payment.rejectionReason = reason;

        const savedPayment = await payment.save();

        try
        {
            const uId = (payment.user as any)?._id?.toString() || (payment.user as any)?.toString();
            if (uId)
            {
                await this.notificationsService.createNotification(
                    uId,
                    NotificationType.PAYMENT_FAILED,
                    'Payment Rejected',
                    `Your payment for booking ${(payment.booking as any).bookingNumber} was rejected. Reason: ${reason}`,
                    { bookingId: payment.booking, paymentId: payment._id }
                );

                if ((payment.user as any).email)
                {
                    await this.notificationsService.sendEmail(
                        (payment.user as any).email,
                        'Payment Rejected',
                        'payment_rejected',
                        {
                            name: (payment.user as any).name,
                            bookingNumber: (payment.booking as any).bookingNumber,
                            tourTitle: ((payment.booking as any).tour as any).title,
                            amount: payment.amount,
                            reason: reason
                        }
                    );
                }
            }
        } catch (err)
        {
            this.logger.error(`Failed to dispatch payment rejection notification for payment ${paymentId}`, err.stack);
        }

        return savedPayment;
    }

    async recordOfflinePayment(adminId: string, dto: any) {
        this.logger.log(`Admin ${adminId} recording offline payment for booking ${dto.bookingId}`);
        const { bookingId, amount, paymentMethod, receiptNumber, collectedAt, notes } = dto;

        const booking = await this.bookingsService.getBookingById(bookingId);
        if (!booking) throw new NotFoundException('Booking not found');

        const payment = new this.paymentModel({
            user: booking.user,
            booking: booking._id,
            method: PaymentMethod.OFFLINE,
            paymentMethod,
            offlineReceiptNumber: receiptNumber,
            offlineCollectedBy: adminId,
            offlineCollectedAt: collectedAt || DateUtil.nowUTC(),
            amount,
            status: PaymentStatus.SUCCESS,
            paidAt: collectedAt || DateUtil.nowUTC(),
            metadata: { notes }
        });
        await payment.save();

        // Update booking
        await this.bookingsService.adminUpdatePaidAmount(booking._id.toString(), amount);

        const updatedBooking = await this.bookingsService.getBookingById(bookingId);
        if (updatedBooking.status === BookingStatus.PENDING)
        {
            if (updatedBooking.pendingAmount <= 0)
            {
                await this.bookingsService.adminConfirmBooking(bookingId);
            } else
            {
                await this.bookingsService.adminUpdateStatus(bookingId, BookingStatus.ON_HOLD, 'Partial payment recorded');
            }
        } else if (updatedBooking.status === BookingStatus.ON_HOLD && updatedBooking.pendingAmount <= 0)
        {
            await this.bookingsService.adminConfirmBooking(bookingId);
        }

        // Create transaction
        await this.transactionsService.createTransaction({
            user: booking.user as any,
            booking: booking._id as any,
            payment: payment._id as any,
            type: TransactionType.PAYMENT,
            amount,
            paymentMethod,
            status: TransactionStatus.SUCCESS,
            processedBy: adminId as any,
            processedAt: DateUtil.nowUTC(),
            description: `Offline payment recorded (${notes || ''})`
        });

        const savedPayment = await payment.save();
        const populatedPayment = await this.paymentModel.findById(payment._id)
            .populate('user')
            .populate({ path: 'booking', populate: { path: 'tour' } })
            .exec();

        // Send Notification
        if (populatedPayment && populatedPayment.user)
        {
            try
            {
                const uId = (populatedPayment.user as any)?._id?.toString() || (populatedPayment.user as any)?.toString();
                if (uId)
                {
                    await this.notificationsService.createNotification(
                        uId,
                        NotificationType.PAYMENT_SUCCESS,
                        'Offline Payment Received',
                        `We have successfully received your offline payment of ${amount} for booking ${(populatedPayment.booking as any).bookingNumber}.`,
                        { bookingId: populatedPayment.booking, paymentId: populatedPayment._id }
                    );

                    if ((populatedPayment.user as any).email)
                    {
                        await this.notificationsService.sendEmail(
                            (populatedPayment.user as any).email,
                            'Offline Payment Received',
                            'payment_approved',
                            {
                                name: (populatedPayment.user as any).name,
                                bookingNumber: (populatedPayment.booking as any).bookingNumber,
                                tourTitle: ((populatedPayment.booking as any).tour as any).title,
                                amount: populatedPayment.amount
                            }
                        );
                    }
                }
            } catch (err)
            {
                this.logger.error(`Failed to dispatch offline payment notification for payment ${payment._id}`, err.stack);
            }
        }

        this.logger.log(`Offline payment recorded successfully: ${savedPayment._id}`);
        return savedPayment;
    }
}
