import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { Tour, TourDocument } from '../../database/schemas/tour.schema';
import { TourDate, TourDateDocument } from '../../database/schemas/tour-date.schema';
import { Coupon, CouponDocument } from '../../database/schemas/coupon.schema';
import { PreviewBookingDto } from './dto/preview-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { generateBookingNumber } from '../../common/helpers/booking-number.helper';
import { CouponsService } from '../coupons/coupons.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(TourDate.name) private tourDateModel: Model<TourDateDocument>,
        private readonly couponsService: CouponsService,
        private readonly notificationsService: NotificationsService,
    ) { }

    async previewBooking(dto: PreviewBookingDto) {
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

        // 4. GST 5%
        const taxableAmount = subtotal - couponDiscount;
        const taxAmount = Math.round(taxableAmount * 0.05);
        const totalAmount = taxableAmount + taxAmount;

        // 5. Generate Readable Summary
        let pricingSummary = '';
        if (pickupOption.priceAdjustment > 0)
        {
            pricingSummary += `${baseAmountPerPerson.toLocaleString()} (Base) + ${pickupOption.priceAdjustment.toLocaleString()} (${pickupOption.type} Pickup) = ${perPersonPrice.toLocaleString()} per person. `;
        } else
        {
            pricingSummary += `${perPersonPrice.toLocaleString()} per person. `;
        }

        pricingSummary += `Total for ${travelerCount} traveler(s): ${subtotal.toLocaleString()}. `;

        if (couponDiscount > 0)
        {
            pricingSummary += `Coupon (${appliedCoupon?.code}): -${couponDiscount.toLocaleString()}. `;
        }

        pricingSummary += `Tax (5%): ${taxAmount.toLocaleString()}. Grand Total: ${totalAmount.toLocaleString()}.`;

        return {
            baseAmount: baseAmountPerPerson,
            perPersonPrice,
            subtotal,
            couponDiscount,
            taxAmount,
            totalAmount,
            appliedCoupon,
            pickupOption,
            pricingSummary
        };
    }

    async createBooking(userId: string, dto: CreateBookingDto) {
        const preview = await this.previewBooking({
            tourDateId: dto.tourDateId,
            pickupOptionIndex: dto.pickupOptionIndex,
            travelerCount: dto.travelers.length,
            couponCode: dto.couponCode
        });

        const tourDate = await this.tourDateModel.findById(dto.tourDateId).exec();
        if (!tourDate) throw new NotFoundException('Tour date not found');

        // Check availability
        const availableSeats = tourDate.totalSeats - tourDate.bookedSeats;
        if (availableSeats < dto.travelers.length)
        {
            throw new ConflictException('Not enough seats available');
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
            discountAmount: preview.couponDiscount,
            couponCode: dto.couponCode?.toUpperCase(),
            totalAmount: preview.totalAmount,
            pendingAmount: preview.totalAmount,
            status: 'pending',
            additionalRequests: dto.additionalRequests,
            pricingSummary: preview.pricingSummary,
        });

        // Increment coupon usage if used
        if (dto.couponCode)
        {
            await this.couponsService.applyCoupon(dto.couponCode);
        }

        const savedBooking = await booking.save();

        // Fire 'Booking Created' notification
        try
        {
            await this.notificationsService.createNotification(
                userId,
                'booking_created', // Correct enum for initial pending bookings
                'Booking Created',
                `Your booking #${savedBooking.bookingNumber} has been created successfully!`,
                { bookingId: savedBooking._id }
            );
        } catch (err)
        {
            console.error('Failed to create notification for booking:', err);
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

        const booking = await this.bookingModel.findByIdAndUpdate(id, update, { new: true }).exec();
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
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) throw new NotFoundException('Booking not found');
        if (booking.status === 'confirmed') return booking;

        // Atomic check seats again just in case
        const tourDate = await this.tourDateModel.findById(booking.tourDate as any).exec();
        if (!tourDate) throw new NotFoundException('Tour date not found');

        const available = tourDate.totalSeats - tourDate.bookedSeats;
        if (available < booking.totalTravelers)
        {
            throw new ConflictException('Tour date is now full, cannot confirm');
        }

        // Increment booked seats
        await this.tourDateModel.findByIdAndUpdate(booking.tourDate, {
            $inc: { bookedSeats: booking.totalTravelers }
        }).exec();

        booking.status = 'confirmed';
        const savedBooking = await booking.save();
        const populatedBooking = await this.bookingModel.findById(booking._id).populate('user').populate('tour');

        // Notify user of manual confirmation
        if (populatedBooking && populatedBooking.user)
        {
            try
            {
                await this.notificationsService.createNotification(
                    (populatedBooking.user as any)._id.toString(),
                    'booking_confirmed',
                    'Booking Confirmed',
                    `Your booking #${populatedBooking.bookingNumber} has been confirmed!`,
                    { bookingId: populatedBooking._id }
                );

                await this.notificationsService.sendEmail(
                    (populatedBooking.user as any).email,
                    'Booking Confirmed',
                    'booking_confirmed',
                    {
                        name: (populatedBooking.user as any).name,
                        bookingNumber: populatedBooking.bookingNumber,
                        tourTitle: (populatedBooking.tour as any).title,
                        amount: populatedBooking.totalAmount
                    }
                );
            } catch (err)
            {
                console.error('Failed to dispatch confirm notification:', err);
            }
        }

        return savedBooking;
    }

    async cancelBooking(id: string, userId?: string) {
        const query: any = { _id: id };
        if (userId) query.user = userId;

        const booking = await this.bookingModel.findOne(query).populate('user').populate('tour').exec();
        if (!booking) throw new NotFoundException('Booking not found');

        if (booking.status === 'cancelled') return booking;

        // If it was confirmed, restore seats
        if (booking.status === 'confirmed')
        {
            await this.tourDateModel.findByIdAndUpdate(booking.tourDate, {
                $inc: { bookedSeats: -booking.totalTravelers }
            }).exec();
        }

        booking.status = 'cancelled';

        // Release coupon if used
        if (booking.couponCode)
        {
            await this.couponsService.releaseCoupon(booking.couponCode);
        }

        const savedBooking = await booking.save();

        try
        {
            await this.notificationsService.createNotification(
                (booking.user as any)._id.toString(),
                'booking_cancelled',
                'Booking Cancelled',
                `Your booking #${booking.bookingNumber} has been cancelled successfully.`,
                { bookingId: booking._id }
            );

            // Assuming a general template fallback if booking_cancelled.hbs is absent
            await this.notificationsService.sendEmail(
                (booking.user as any).email,
                'Booking Cancelled',
                'general',
                {
                    name: (booking.user as any).name,
                    body: `Your booking #${booking.bookingNumber} for ${(booking.tour as any).title} has been cancelled.`
                }
            );
        } catch (err)
        {
            console.error('Failed to dispatch cancel notification:', err);
        }

        return savedBooking;
    }
}
