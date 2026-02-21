import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '../../database/schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { NotificationsService } from '../notifications/notifications.service';

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
        if (booking.status !== 'pending') throw new BadRequestException('Booking is not pending');

        // Check if payment already exists for this transaction ID
        const existing = await this.paymentModel.findOne({ transactionId }).exec();

        if (existing) throw new ConflictException('Transaction ID already used');

        const payment = new this.paymentModel({
            user: userId,
            booking: bookingId,
            paymentType: 'online',
            paymentMethod,
            transactionId,
            paymentReceiptImage: receiptImage,
            amount: booking.totalAmount, // Assuming full payment for now
            status: 'under_review',
        });

        return payment.save();
    }

    async getMyPayments(userId: string) {
        return this.paymentModel.find({ user: userId } as any).sort({ createdAt: -1 }).populate('booking', 'bookingNumber').exec();
    }

    async getPaymentById(id: string) {
        return this.paymentModel.findById(id).populate('user', 'name email').populate('booking').exec();
    }

    // Admin methods
    async getPendingPayments() {
        return this.paymentModel.find({ status: 'under_review' })
            .populate('user', 'name email')
            .populate('booking', 'bookingNumber totalAmount')
            .sort({ createdAt: 1 })
            .exec();
    }

    async approvePayment(paymentId: string, adminId: string) {
        this.logger.log(`Admin ${adminId} approving payment: ${paymentId}`);
        const payment = await this.paymentModel.findById(paymentId).exec();

        if (!payment) throw new NotFoundException('Payment not found');
        if (payment.status !== 'under_review') throw new BadRequestException('Payment not under review');

        payment.status = 'success';
        payment.verifiedBy = adminId as any;
        payment.verifiedAt = new Date();
        payment.paidAt = new Date();
        await payment.save();

        // Confirm booking
        await this.bookingsService.adminConfirmBooking(payment.booking.toString());
        await this.bookingsService.adminUpdatePaidAmount(payment.booking.toString(), payment.amount);

        // Create transaction record
        await this.transactionsService.createTransaction({
            user: payment.user as any,
            booking: payment.booking as any,
            payment: payment._id as any,
            type: 'payment',
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId,
            status: 'success',
            processedBy: adminId as any,
            processedAt: new Date(),
            description: 'Online payment approved'
        });

        // Send notification
        const booking = await this.bookingsService.getBookingById(payment.booking.toString());
        await this.notificationsService.createNotification(
            payment.user.toString(),
            'payment_success',
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

        payment.status = 'rejected';
        payment.verifiedBy = adminId as any;
        payment.verifiedAt = new Date();
        payment.rejectionReason = reason;

        const savedPayment = await payment.save();

        try
        {
            const uId = (payment.user as any)?._id?.toString() || (payment.user as any)?.toString();
            if (uId)
            {
                await this.notificationsService.createNotification(
                    uId,
                    'payment_failed',
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
            paymentType: 'offline',
            paymentMethod,
            offlineReceiptNumber: receiptNumber,
            offlineCollectedBy: adminId,
            offlineCollectedAt: collectedAt || new Date(),
            amount,
            status: 'success',
            paidAt: collectedAt || new Date(),
            metadata: { notes }
        });
        await payment.save();

        // Update booking
        await this.bookingsService.adminUpdatePaidAmount(booking._id.toString(), amount);

        const updatedBooking = await this.bookingsService.getBookingById(bookingId);
        if (updatedBooking.status === 'pending')
        {
            if (updatedBooking.pendingAmount <= 0)
            {
                await this.bookingsService.adminConfirmBooking(bookingId);
            } else
            {
                await this.bookingsService.adminUpdateStatus(bookingId, 'on_hold', 'Partial payment recorded');
            }
        } else if (updatedBooking.status === 'on_hold' && updatedBooking.pendingAmount <= 0)
        {
            await this.bookingsService.adminConfirmBooking(bookingId);
        }

        // Create transaction
        await this.transactionsService.createTransaction({
            user: booking.user as any,
            booking: booking._id as any,
            payment: payment._id as any,
            type: 'payment',
            amount,
            paymentMethod,
            status: 'success',
            processedBy: adminId as any,
            processedAt: new Date(),
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
                        'payment_success',
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
