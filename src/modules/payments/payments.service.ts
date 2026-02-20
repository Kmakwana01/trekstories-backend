import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from '../../database/schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
        private bookingsService: BookingsService,
        private transactionsService: TransactionsService,
    ) { }

    async submitPaymentProof(userId: string, dto: any) {
        const { bookingId, transactionId, paymentMethod, receiptImage } = dto;

        const booking = await this.bookingsService.getBookingById(bookingId, userId);
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.status !== 'pending') throw new BadRequestException('Booking is not pending');

        // Check if payment already exists for this transaction ID
        const existing = await this.paymentModel.findOne({ transactionId });
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

        // Update booking metadata? Or wait for approval.
        // We might want to link the payment ID in the booking, but booking schema doesn't have it yet.
        // But we added 'receiptImage' and 'transactionId' to booking schema in Phase 8?
        // Let's rely on Payment collection as source of truth for payments.

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
        const payment = await this.paymentModel.findById(paymentId);
        if (!payment) throw new NotFoundException('Payment not found');
        if (payment.status !== 'under_review') throw new BadRequestException('Payment not under review');

        payment.status = 'success';
        payment.verifiedBy = adminId as any;
        payment.verifiedAt = new Date();
        payment.paidAt = new Date(); // Or create date?
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

        return payment;
    }

    async rejectPayment(paymentId: string, adminId: string, reason: string) {
        const payment = await this.paymentModel.findById(paymentId);
        if (!payment) throw new NotFoundException('Payment not found');

        payment.status = 'rejected';
        payment.verifiedBy = adminId as any;
        payment.verifiedAt = new Date();
        payment.rejectionReason = reason;

        return payment.save();
    }

    async recordOfflinePayment(adminId: string, dto: any) {
        const { bookingId, amount, paymentMethod, receiptNumber, collectedAt, notes } = dto;

        const booking = await this.bookingsService.getBookingById(bookingId);
        if (!booking) throw new NotFoundException('Booking not found');

        const payment = new this.paymentModel({
            user: booking.user,
            booking: booking._id,
            paymentType: 'offline',
            paymentMethod, // cash, upi
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

        // If fully paid (or overpaid), confirm
        // adminUpdatePaidAmount handles pendingAmount calculation.
        // We need to check if pendingAmount <= 0.
        // But adminUpdatePaidAmount returns the updated booking.
        const updatedBooking = await this.bookingsService.getBookingById(bookingId);
        if (updatedBooking.status === 'pending')
        {
            if (updatedBooking.pendingAmount <= 0)
            {
                await this.bookingsService.adminConfirmBooking(bookingId);
            } else
            {
                // Partial payment -> on_hold
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

        return payment;
    }
}
