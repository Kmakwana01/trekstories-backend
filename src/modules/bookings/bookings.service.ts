import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { Tour, TourDocument } from '../../database/schemas/tour.schema';
import { TourDate, TourDateDocument } from '../../database/schemas/tour-date.schema';
import { PreviewBookingDto } from './dto/preview-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { generateBookingNumber } from '../../common/helpers/booking-number.helper';
import { CouponsService } from '../coupons/coupons.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
import { BookingStatus, PaymentType, RefundStatus } from '../../common/enums/booking-status.enum';
import { TourDateStatus } from '../../common/enums/tour-date-status.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Injectable()
export class BookingsService {
    private readonly logger = new Logger(BookingsService.name);

    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(TourDate.name) private tourDateModel: Model<TourDateDocument>,
        private readonly couponsService: CouponsService,
        private readonly notificationsService: NotificationsService,
        private readonly settingsService: SettingsService,
    ) { }

    async previewBooking(dto: PreviewBookingDto) {
        this.logger.log(`Previewing booking for tour date: ${dto.tourDateId}`);
        const { tourDateId, pickupOptionIndex, travelerCount, couponCode } = dto;

        const tourDate = await this.tourDateModel.findById(tourDateId).populate('tour').exec();
        if (!tourDate) throw new NotFoundException('Tour date not found');

        const tour = tourDate.tour as unknown as Tour;
        if (!tour) throw new NotFoundException('Tour not found');

        // 1. Calculate base price
        const baseAmountPerPerson = tourDate.priceOverride || tour.basePrice;

        // 2. Pickup adjustment
        if (pickupOptionIndex < 0 || pickupOptionIndex >= tour.departureOptions.length)
        {
            throw new BadRequestException('Invalid pickup option index');
        }
        const pickupOption = tour.departureOptions[pickupOptionIndex];
        const perPersonPrice = baseAmountPerPerson + pickupOption.priceAdjustment;

        const subtotal = perPersonPrice * travelerCount;

        // 3. Coupon discount
        let couponDiscount = 0;
        let appliedCoupon: any = null;

        if (couponCode)
        {
            try
            {
                const validation = await this.couponsService.validateCoupon(
                    couponCode,
                    '', // userId is optional for basic validation here
                    (tour as any)._id.toString(),
                    subtotal
                );

                couponDiscount = validation.discountAmount;
                appliedCoupon = validation.coupon;
            } catch (error)
            {
                // If coupon invalid, we can either throw or just ignore it 
                // In preview, maybe we should just not apply it and show no discount?
                // But usually better to throw error if user explicitly provided a code.
                throw error;
            }
        }

        // 4. GST — rate fetched dynamically from admin settings
        const settings = await this.settingsService.getSettings();
        const gstRate = settings?.businessDetails?.gstRate ?? 5; // fallback to 5% if not configured
        const taxableAmount = subtotal - couponDiscount;
        const taxAmount = gstRate > 0 ? Math.round(taxableAmount * (gstRate / 100)) : 0;
        const totalAmount = taxableAmount + taxAmount;

        const fmt = (val: number) => new Intl.NumberFormat('en-IN').format(val);

        // 5. Generate Readable Summary
        let pricingSummary = '';
        if (pickupOption.priceAdjustment > 0)
        {
            pricingSummary += `${fmt(baseAmountPerPerson)} (Base) + ${fmt(pickupOption.priceAdjustment)} (Extra) = ${fmt(perPersonPrice)} per person. `;
        } else
        {
            pricingSummary += `${fmt(perPersonPrice)} per person. `;
        }

        pricingSummary += `Total for ${travelerCount} traveler(s): ${fmt(subtotal)}. `;

        if (couponDiscount > 0)
        {
            pricingSummary += `Coupon (${appliedCoupon?.code}): -${fmt(couponDiscount)}. `;
        }

        if (gstRate > 0)
        {
            pricingSummary += `Tax (${gstRate}%): ${fmt(taxAmount)}. `;
        }
        pricingSummary += `Grand Total: ${fmt(totalAmount)}.`;

        return {
            baseAmount: baseAmountPerPerson,
            perPersonPrice,
            subtotal,
            couponDiscount,
            taxAmount,
            taxRate: gstRate,
            totalAmount,
            halfAmount: Math.ceil(totalAmount / 2),
            appliedCoupon,
            pickupOption,
            pricingSummary
        };
    }

    async getUpcomingDepartures(startDate: Date, endDate: Date): Promise<Booking[]> {
        const dates = await this.tourDateModel.find({
            startDate: { $gte: startDate, $lte: endDate },
            status: TourDateStatus.UPCOMING
        }).exec();

        const dateIds = dates.map(d => d._id);

        return this.bookingModel.find({
            tourDate: { $in: dateIds as any[] },
            status: { $in: [BookingStatus.CONFIRMED] }
        } as any).populate('user').populate({ path: 'tourDate', populate: { path: 'tour' } }).exec();
    }

    async createBooking(userId: string, dto: CreateBookingDto) {
        this.logger.log(`Creating booking for user ${userId} on tour date ${dto.tourDateId}`);
        const preview = await this.previewBooking({
            tourDateId: dto.tourDateId,
            pickupOptionIndex: dto.pickupOptionIndex,
            travelerCount: dto.travelers.length,
            couponCode: dto.couponCode
        });

        // Atomic check and reserve seats
        const updatedDate = await this.tourDateModel.findOneAndUpdate(
            {
                _id: dto.tourDateId,
                status: TourDateStatus.UPCOMING,
                $expr: { $gte: [{ $subtract: ['$totalSeats', '$bookedSeats'] }, dto.travelers.length] }
            },
            { $inc: { bookedSeats: dto.travelers.length } },
            { new: true }
        ).exec();

        if (!updatedDate)
        {
            // Fetch to give a precise error
            const check = await this.tourDateModel.findById(dto.tourDateId).exec();
            if (!check) throw new ConflictException('Tour date not found');
            if (check.status !== TourDateStatus.UPCOMING) throw new ConflictException(`Tour date is ${check.status} and not accepting bookings.`);
            const available = check.totalSeats - check.bookedSeats;
            throw new ConflictException(`Not enough seats available. Only ${available} seat(s) left.`);
        }

        if (updatedDate.bookedSeats >= updatedDate.totalSeats)
        {
            await this.tourDateModel.findByIdAndUpdate(dto.tourDateId, { status: TourDateStatus.FULL });
        }


        const bNo = await generateBookingNumber(this.bookingModel);

        const booking = new this.bookingModel({
            bookingNumber: bNo,
            user: userId,
            tour: updatedDate.tour,
            tourDate: updatedDate._id,
            pickupOption: preview.pickupOption,
            travelers: dto.travelers,
            totalTravelers: dto.travelers.length,
            perPersonPrice: preview.perPersonPrice,
            baseAmount: preview.baseAmount,
            taxAmount: preview.taxAmount,
            taxRate: preview.taxRate,
            discountAmount: preview.couponDiscount,
            couponCode: dto.couponCode?.toUpperCase(),
            totalAmount: preview.totalAmount,
            pendingAmount: preview.totalAmount,
            paymentType: dto.paymentType === 'PARTIAL' ? PaymentType.PARTIAL : undefined,
            status: BookingStatus.PENDING,
            additionalRequests: dto.additionalRequests,
            pricingSummary: preview.pricingSummary,
        });

        // Increment coupon usage if used
        if (dto.couponCode)
        {
            await this.couponsService.applyCoupon(dto.couponCode);
        }

        let savedBooking;
        try
        {
            savedBooking = await booking.save();
        } catch (error)
        {
            // IMPORTANT: If booking fails to save (e.g. validation error), restore the seats!
            await this.tourDateModel.findByIdAndUpdate(dto.tourDateId, { $inc: { bookedSeats: -dto.travelers.length } });
            // Re-fetch and check if it was FULL, then revert to UPCOMING
            const check = await this.tourDateModel.findById(dto.tourDateId).exec();
            if (check && check.status === TourDateStatus.FULL && check.bookedSeats < check.totalSeats)
            {
                await this.tourDateModel.findByIdAndUpdate(dto.tourDateId, { status: TourDateStatus.UPCOMING });
            }

            if (error.code === 11000)
            {
                this.logger.error(`Concurrency error on booking creation: duplicated booking number ${bNo}`);
                throw new ConflictException('Concurrency error during booking. Please try again.');
            }
            throw error;
        }
        this.logger.log(`Booking created successfully: #${savedBooking.bookingNumber} (${savedBooking._id})`);

        // Fire 'Booking Created' notification
        try
        {
            await this.notificationsService.createNotification(
                userId,
                NotificationType.BOOKING_CREATED,
                'Booking Created',
                `Your booking #${savedBooking.bookingNumber} has been created successfully!`,
                { bookingId: savedBooking._id }
            );
        } catch (err)
        {
            this.logger.error(`Failed to create notification for booking ${savedBooking.bookingNumber}`, err.stack);
        }

        return savedBooking.toObject();
    }

    async getMyBookings(userId: string) {
        const query: any = { user: userId };
        return this.bookingModel.find(query)
            .populate('tour', 'title slug thumbnailImage location')
            .populate('tourDate', 'startDate endDate status totalSeats bookedSeats')
            .sort({ createdAt: -1 })
            .exec();
    }

    async getBookingById(id: string, userId?: string) {
        const query: any = { _id: id };
        if (userId) query.user = userId;

        const booking = await this.bookingModel.findOne(query)
            .populate('user', 'name email phone')
            .populate('tour', 'title slug location category thumbnailImage')
            .populate('tourDate', 'startDate endDate status totalSeats bookedSeats')
            .exec();

        if (!booking) throw new NotFoundException('Booking not found');
        return booking.toObject({ virtuals: true });
    }

    async adminGetAllBookings(filters: any = {}) {
        const { search, status, startDate, endDate, page = 1, limit = 10 } = filters;
        const query: any = {};

        if (status) query.status = status;
        if (startDate || endDate)
        {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate)
            {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }
        if (search) query.bookingNumber = { $regex: search, $options: 'i' };

        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            this.bookingModel.find(query)
                .populate('user', 'name email')
                .populate('tour', 'title thumbnailImage')
                .populate('tourDate', 'startDate endDate')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .exec(),
            this.bookingModel.countDocuments(query),
        ]);

        return { items, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }

    async adminUpdateStatus(id: string, status: string, note?: string, adminId?: string) {
        const oldBooking = await this.bookingModel.findById(id).exec();
        if (!oldBooking) throw new NotFoundException('Booking not found');

        const oldStatus = oldBooking.status;
        const newStatus = status.toUpperCase();

        // 1. Seat Arithmetic for Status Changes
        if (oldStatus !== BookingStatus.CANCELLED && newStatus === BookingStatus.CANCELLED)
        {
            // Restoring seats as it moves TO cancelled
            const restoredDate = await this.tourDateModel.findByIdAndUpdate(
                oldBooking.tourDate,
                { $inc: { bookedSeats: -oldBooking.totalTravelers } },
                { new: true }
            ).exec();
            if (restoredDate && restoredDate.status === TourDateStatus.FULL && restoredDate.bookedSeats < restoredDate.totalSeats)
            {
                await this.tourDateModel.findByIdAndUpdate(oldBooking.tourDate, { status: TourDateStatus.UPCOMING });
            }
        } else if (oldStatus === BookingStatus.CANCELLED && newStatus !== BookingStatus.CANCELLED)
        {
            // Re-reserving seats as it moves FROM cancelled
            const updatedDate = await this.tourDateModel.findOneAndUpdate(
                {
                    _id: oldBooking.tourDate,
                    $expr: { $gte: [{ $subtract: ['$totalSeats', '$bookedSeats'] }, oldBooking.totalTravelers] }
                },
                { $inc: { bookedSeats: oldBooking.totalTravelers } },
                { new: true }
            ).exec();

            if (!updatedDate) throw new BadRequestException('Cannot revert cancellation: Not enough seats available on this tour date.');
            if (updatedDate.bookedSeats >= updatedDate.totalSeats)
            {
                await this.tourDateModel.findByIdAndUpdate(oldBooking.tourDate, { status: TourDateStatus.FULL });
            }
        }

        const updateOp: any = { status: newStatus };
        if (note)
        {
            updateOp.$push = {
                internalNotes: { note, createdAt: new Date(), adminId: adminId || null },
            };
        }
        const booking = await this.bookingModel.findByIdAndUpdate(id, updateOp, { returnDocument: 'after', new: true })
            .populate('user', 'name email')
            .exec();
        return booking;
    }

    async adminUpdatePaidAmount(id: string, amount: number) {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) throw new NotFoundException('Booking not found');

        booking.paidAmount += amount;
        booking.pendingAmount = Math.max(0, booking.totalAmount - booking.paidAmount);

        return booking.save();
    }

    /** Called by PaymentsService after receipt upload to sync fields onto the Booking document */
    async syncBookingReceiptInfo(id: string, receiptImage: string, transactionId: string, paymentType: string) {
        return this.bookingModel.findByIdAndUpdate(id, { receiptImage, transactionId, paymentType }, { new: true }).exec();
    }

    /** Called by PaymentsService after approving a payment to mark the receipt as verified */
    async markPaymentVerified(id: string) {
        return this.bookingModel.findByIdAndUpdate(id, {
            paymentVerifiedAt: new Date(),
            receiptImage: null,
            transactionId: null
        }, { new: true }).exec();
    }

    async adminUpdatePaymentTypeAndNote(id: string, paymentType: string, note?: string, adminId?: string) {
        const updateOp: any = { paymentType };
        if (note)
        {
            updateOp.$push = { internalNotes: { note, createdAt: new Date(), adminId: adminId || null } };
        }
        return this.bookingModel.findByIdAndUpdate(id, updateOp, { new: true }).exec();
    }

    async adminCancelBooking(id: string) {
        return this.cancelBooking(id);
    }

    async adminVerifyReceipt(id: string, approve: boolean, adminId?: string) {
        const booking = await this.bookingModel.findById(id).populate('user').populate('tour').exec();
        if (!booking) throw new NotFoundException('Booking not found');

        if (approve)
        {
            // Set payment fields FIRST, then let adminConfirmBooking handle status + seats + notifications
            booking.paymentVerifiedAt = new Date();
            booking.paidAmount = booking.totalAmount;
            booking.pendingAmount = 0;
            // Do NOT set booking.status = CONFIRMED here — adminConfirmBooking checks for it and would exit early
            await booking.save();

            // Confirm the booking (sets status → CONFIRMED, increments booked seats, sends notification + email)
            await this.adminConfirmBooking(id);

            this.logger.log(`Receipt approved and booking confirmed: #${booking.bookingNumber}`);
        } else
        {
            // Reject receipt — keep booking in PENDING AND clear receipt fields so user can re-upload
            await this.bookingModel.findByIdAndUpdate(id, {
                status: BookingStatus.PENDING,
                receiptImage: null,
                transactionId: null,
                $push: { internalNotes: { note: 'Payment receipt was rejected by admin.', createdAt: new Date(), adminId: adminId || null } },
            }).exec();

            this.logger.log(`Receipt rejected for booking: #${booking.bookingNumber}`);

            // Notify user
            const uId = (booking.user as any)?._id?.toString() || (booking.user as any)?.toString();
            if (uId)
            {
                try
                {
                    await this.notificationsService.createNotification(
                        uId,
                        NotificationType.PAYMENT_FAILED,
                        'Payment Receipt Rejected',
                        `Your payment receipt for booking #${booking.bookingNumber} was rejected. Please re-upload a valid receipt.`,
                        { bookingId: booking._id }
                    );
                } catch (err)
                {
                    this.logger.error(`Failed to notify user on receipt rejection: ${booking.bookingNumber}`, err.stack);
                }
            }
        }

        return this.bookingModel.findById(id).populate('user', 'name email').populate('tour').populate('tourDate').exec();
    }

    async adminConfirmBooking(id: string) {
        this.logger.log(`Admin confirming booking: ${id}`);
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.status === BookingStatus.CONFIRMED) return booking;

        // If admin confirms manually with no payment record, assume it is an OFFLINE booking
        if (booking.paidAmount === 0 && !booking.paymentType)
        {
            booking.paymentType = PaymentType.OFFLINE;
        }

        // Seats are now reserved at booking creation, so we don't increment them here anymore.

        booking.status = BookingStatus.CONFIRMED;
        const savedBooking = await booking.save();
        const populatedBooking = await this.bookingModel.findById(booking._id)
            .populate('user')
            .populate('tour')
            .populate('tourDate')
            .exec();

        // Notify user of manual confirmation
        if (populatedBooking && populatedBooking.user)
        {
            try
            {
                await this.notificationsService.createNotification(
                    (populatedBooking.user as any)._id.toString(),
                    NotificationType.BOOKING_CONFIRMED,
                    'Booking Confirmed',
                    `Your booking #${populatedBooking.bookingNumber} has been confirmed!`,
                    { bookingId: populatedBooking._id }
                );

                await this.notificationsService.sendEmail(
                    (populatedBooking.user as any).email,
                    'Booking Confirmed',
                    NotificationType.BOOKING_CONFIRMED,
                    {
                        name: (populatedBooking.user as any).name,
                        bookingNumber: populatedBooking.bookingNumber,
                        tourTitle: (populatedBooking.tour as any)?.title,
                        startDate: (populatedBooking.tourDate as any)?.startDate,
                        amount: populatedBooking.totalAmount
                    }
                );
            } catch (err)
            {
                this.logger.error(`Failed to dispatch confirm notification for booking ${populatedBooking.bookingNumber}`, err.stack);
            }
        }

        this.logger.log(`Booking confirmed successfully: #${savedBooking.bookingNumber}`);
        return savedBooking;
    }

    async cancelBooking(id: string, userId?: string) {
        this.logger.log(`Cancelling booking: ${id} (User: ${userId || 'Admin'})`);
        const query: any = { _id: id };
        if (userId) query.user = userId;

        const booking = await this.bookingModel.findOne(query).populate('user').populate('tour').exec();
        if (!booking) throw new NotFoundException('Booking not found');

        if (booking.status === BookingStatus.CANCELLED) return booking;

        // Restore bookedSeats since they were reserved at creation
        const restoredDate = await this.tourDateModel.findByIdAndUpdate(
            booking.tourDate,
            { $inc: { bookedSeats: -booking.totalTravelers } },
            { returnDocument: 'after' }
        ).exec();
        // If it was marked full, but now has available seats, revert back to upcoming
        if (restoredDate && restoredDate.status === TourDateStatus.FULL && restoredDate.bookedSeats < restoredDate.totalSeats)
        {
            await this.tourDateModel.findByIdAndUpdate(booking.tourDate, { status: TourDateStatus.UPCOMING });
            this.logger.log(`Tour date ${booking.tourDate} reverted from FULL to UPCOMING after cancellation of booking ${id}`);
        }

        booking.status = BookingStatus.CANCELLED;

        // Release coupon if used
        if (booking.couponCode)
        {
            await this.couponsService.releaseCoupon(booking.couponCode);
        }

        // Auto-request refund if payment exists
        if (booking.paidAmount > 0)
        {
            booking.refundStatus = RefundStatus.REQUESTED;
            booking.refundReason = 'Auto-requested on booking cancellation';
            booking.refundRequestedAt = new Date();
        }

        const savedBooking = await booking.save();
        this.logger.log(`Booking cancelled successfully: #${savedBooking.bookingNumber}`);

        try
        {
            const uId = (booking.user as any)?._id?.toString() || (booking.user as any)?.toString();
            if (uId)
            {
                await this.notificationsService.createNotification(
                    uId,
                    NotificationType.BOOKING_CANCELLED,
                    'Booking Cancelled',
                    `Your booking #${booking.bookingNumber} has been cancelled successfully.`,
                    { bookingId: booking._id }
                );

                if ((booking.user as any).email)
                {
                    await this.notificationsService.sendEmail(
                        (booking.user as any).email,
                        'Booking Cancelled',
                        NotificationType.GENERAL,
                        {
                            name: (booking.user as any).name,
                            message: `Your booking #${booking.bookingNumber} for ${(booking.tour as any).title} has been cancelled.`
                        }
                    );
                }
            }
        } catch (err)
        {
            this.logger.error(`Failed to dispatch cancel notification for booking ${booking.bookingNumber}`, err.stack);
        }

        return savedBooking;
    }
}
