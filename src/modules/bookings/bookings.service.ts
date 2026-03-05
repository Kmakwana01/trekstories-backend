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
import { BookingStatus } from '../../common/enums/booking-status.enum';
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
            pricingSummary += `${fmt(baseAmountPerPerson)} (Base) + ${fmt(pickupOption.priceAdjustment)} (${pickupOption.type} Pickup) = ${fmt(perPersonPrice)} per person. `;
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

        // Read-only availability check — seats are NOT incremented yet.
        // They will only be incremented when the booking is CONFIRMED (payment approved).
        const tourDate = await this.tourDateModel.findById(dto.tourDateId).exec();
        if (!tourDate)
        {
            throw new ConflictException('Tour date not found');
        }
        const available = tourDate.totalSeats - tourDate.bookedSeats;
        if (available < dto.travelers.length)
        {
            this.logger.warn(`Booking failed: Only ${available} seats available for tour date ${dto.tourDateId}`);
            throw new ConflictException(`Not enough seats available. Only ${available} seat(s) left.`);
        }
        if (tourDate.status === TourDateStatus.FULL || tourDate.status === TourDateStatus.CANCELLED)
        {
            throw new ConflictException(`Tour date is ${tourDate.status} and not accepting bookings.`);
        }

        const bNo = await generateBookingNumber(this.bookingModel);

        const booking = new this.bookingModel({
            bookingNumber: bNo,
            user: userId,
            tour: tourDate.tour,
            tourDate: tourDate._id,
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
        return this.bookingModel.find(filters)
            .populate('user', 'name email')
            .populate('tour', 'title')
            .populate('tourDate', 'startDate')
            .sort({ createdAt: -1 })
            .exec();
    }

    async adminUpdateStatus(id: string, status: string, internalNotes?: string) {
        const update: any = { status };
        if (internalNotes) update.internalNotes = internalNotes;

        const booking = await this.bookingModel.findByIdAndUpdate(id, update, { returnDocument: 'after' }).exec();
        if (!booking) throw new NotFoundException('Booking not found');
        return booking;
    }

    async adminUpdatePaidAmount(id: string, amount: number) {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) throw new NotFoundException('Booking not found');

        booking.paidAmount += amount;
        booking.pendingAmount = booking.totalAmount - booking.paidAmount;

        if (booking.pendingAmount <= 0)
        {
            booking.pendingAmount = 0;
            // If fully paid, we might auto-confirm, but usually admin does it.
            // Let's keep it manual or based on business rule.
        }

        return booking.save();
    }

    async adminConfirmBooking(id: string) {
        this.logger.log(`Admin confirming booking: ${id}`);
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.status === BookingStatus.CONFIRMED) return booking;

        // Atomically increment bookedSeats on confirmation (NOT at booking creation)
        const updatedDate = await this.tourDateModel.findByIdAndUpdate(
            booking.tourDate,
            { $inc: { bookedSeats: booking.totalTravelers } },
            { returnDocument: 'after' }
        ).exec();

        // Auto-mark tour date as 'full' when all seats are taken
        if (updatedDate && updatedDate.bookedSeats >= updatedDate.totalSeats)
        {
            await this.tourDateModel.findByIdAndUpdate(booking.tourDate, { status: TourDateStatus.FULL });
            this.logger.log(`Tour date ${booking.tourDate} marked as FULL after confirmation of booking ${id}`);
        }

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

        // Only restore bookedSeats if the booking was CONFIRMED (seats were only incremented on confirmation)
        if (booking.status === BookingStatus.CONFIRMED)
        {
            const restoredDate = await this.tourDateModel.findByIdAndUpdate(
                booking.tourDate,
                { $inc: { bookedSeats: -booking.totalTravelers } },
                { returnDocument: 'after' }
            ).exec();
            // If it was marked full, revert back to upcoming
            if (restoredDate && restoredDate.status === TourDateStatus.FULL)
            {
                await this.tourDateModel.findByIdAndUpdate(booking.tourDate, { status: TourDateStatus.UPCOMING });
                this.logger.log(`Tour date ${booking.tourDate} reverted from FULL to upcoming after cancellation of booking ${id}`);
            }
        }

        booking.status = BookingStatus.CANCELLED;

        // Release coupon if used
        if (booking.couponCode)
        {
            await this.couponsService.releaseCoupon(booking.couponCode);
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
