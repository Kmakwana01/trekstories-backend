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
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../../database/schemas/booking.schema");
const tour_schema_1 = require("../../database/schemas/tour.schema");
const tour_date_schema_1 = require("../../database/schemas/tour-date.schema");
const booking_number_helper_1 = require("../../common/helpers/booking-number.helper");
const coupons_service_1 = require("../coupons/coupons.service");
const notifications_service_1 = require("../notifications/notifications.service");
const settings_service_1 = require("../settings/settings.service");
const booking_status_enum_1 = require("../../common/enums/booking-status.enum");
const tour_date_status_enum_1 = require("../../common/enums/tour-date-status.enum");
const notification_type_enum_1 = require("../../common/enums/notification-type.enum");
let BookingsService = BookingsService_1 = class BookingsService {
    bookingModel;
    tourModel;
    tourDateModel;
    couponsService;
    notificationsService;
    settingsService;
    logger = new common_1.Logger(BookingsService_1.name);
    constructor(bookingModel, tourModel, tourDateModel, couponsService, notificationsService, settingsService) {
        this.bookingModel = bookingModel;
        this.tourModel = tourModel;
        this.tourDateModel = tourDateModel;
        this.couponsService = couponsService;
        this.notificationsService = notificationsService;
        this.settingsService = settingsService;
    }
    async previewBooking(dto) {
        this.logger.log(`Previewing booking for tour date: ${dto.tourDateId}`);
        const { tourDateId, pickupOptionIndex, travelerCount, couponCode } = dto;
        const tourDate = await this.tourDateModel
            .findById(tourDateId)
            .populate('tour')
            .exec();
        if (!tourDate)
            throw new common_1.NotFoundException('Tour date not found');
        const tour = tourDate.tour;
        if (!tour)
            throw new common_1.NotFoundException('Tour not found');
        const baseAmountPerPerson = tourDate.priceOverride || tour.basePrice;
        if (pickupOptionIndex < 0 ||
            pickupOptionIndex >= tour.departureOptions.length) {
            throw new common_1.BadRequestException('Invalid pickup option index');
        }
        const pickupOption = tour.departureOptions[pickupOptionIndex];
        const perPersonPrice = baseAmountPerPerson + pickupOption.priceAdjustment;
        const subtotal = perPersonPrice * travelerCount;
        let couponDiscount = 0;
        let appliedCoupon = null;
        if (couponCode) {
            try {
                const validation = await this.couponsService.validateCoupon(couponCode, '', tour._id.toString(), subtotal);
                couponDiscount = validation.discountAmount;
                appliedCoupon = validation.coupon;
            }
            catch (error) {
                throw error;
            }
        }
        const settings = await this.settingsService.getSettings();
        const gstRate = settings?.businessDetails?.gstRate ?? 5;
        const taxableAmount = subtotal - couponDiscount;
        const taxAmount = gstRate > 0 ? Math.round(taxableAmount * (gstRate / 100)) : 0;
        const totalAmount = taxableAmount + taxAmount;
        const fmt = (val) => new Intl.NumberFormat('en-IN').format(val);
        let pricingSummary = '';
        if (pickupOption.priceAdjustment > 0) {
            pricingSummary += `${fmt(baseAmountPerPerson)} (Base) + ${fmt(pickupOption.priceAdjustment)} (Extra) = ${fmt(perPersonPrice)} per person. `;
        }
        else {
            pricingSummary += `${fmt(perPersonPrice)} per person. `;
        }
        pricingSummary += `Total for ${travelerCount} traveler(s): ${fmt(subtotal)}. `;
        if (couponDiscount > 0) {
            pricingSummary += `Coupon (${appliedCoupon?.code}): -${fmt(couponDiscount)}. `;
        }
        if (gstRate > 0) {
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
            pricingSummary,
        };
    }
    async getUpcomingDepartures(startDate, endDate) {
        const dates = await this.tourDateModel
            .find({
            startDate: { $gte: startDate, $lte: endDate },
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
        })
            .exec();
        const dateIds = dates.map((d) => d._id);
        return this.bookingModel
            .find({
            tourDate: { $in: dateIds },
            status: { $in: [booking_status_enum_1.BookingStatus.CONFIRMED] },
        })
            .populate('user')
            .populate({ path: 'tourDate', populate: { path: 'tour' } })
            .exec();
    }
    async createBooking(userId, dto) {
        this.logger.log(`Creating booking for user ${userId} on tour date ${dto.tourDateId}`);
        const preview = await this.previewBooking({
            tourDateId: dto.tourDateId,
            pickupOptionIndex: dto.pickupOptionIndex,
            travelerCount: dto.travelers.length,
            couponCode: dto.couponCode,
        });
        const updatedDate = await this.tourDateModel
            .findOneAndUpdate({
            _id: dto.tourDateId,
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
            $expr: {
                $gte: [
                    { $subtract: ['$totalSeats', '$bookedSeats'] },
                    dto.travelers.length,
                ],
            },
        }, { $inc: { bookedSeats: dto.travelers.length } }, { returnDocument: 'after' })
            .exec();
        if (!updatedDate) {
            const check = await this.tourDateModel.findById(dto.tourDateId).exec();
            if (!check)
                throw new common_1.ConflictException('Tour date not found');
            if (check.status !== tour_date_status_enum_1.TourDateStatus.UPCOMING)
                throw new common_1.ConflictException(`Tour date is ${check.status} and not accepting bookings.`);
            const available = check.totalSeats - check.bookedSeats;
            throw new common_1.ConflictException(`Not enough seats available. Only ${available} seat(s) left.`);
        }
        if (updatedDate.bookedSeats >= updatedDate.totalSeats) {
            await this.tourDateModel.findByIdAndUpdate(dto.tourDateId, {
                status: tour_date_status_enum_1.TourDateStatus.FULL,
            });
        }
        const bNo = await (0, booking_number_helper_1.generateBookingNumber)(this.bookingModel);
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
            paymentType: dto.paymentType === 'PARTIAL' ? booking_status_enum_1.PaymentType.PARTIAL : undefined,
            partialPaymentAmount: dto.paymentType === 'PARTIAL' && dto.partialAmount
                ? dto.partialAmount
                : undefined,
            status: booking_status_enum_1.BookingStatus.PENDING,
            additionalRequests: dto.additionalRequests,
            pricingSummary: preview.pricingSummary,
        });
        if (dto.couponCode) {
            await this.couponsService.applyCoupon(dto.couponCode);
        }
        let savedBooking;
        try {
            savedBooking = await booking.save();
        }
        catch (error) {
            await this.tourDateModel.findByIdAndUpdate(dto.tourDateId, {
                $inc: { bookedSeats: -dto.travelers.length },
            });
            const check = await this.tourDateModel.findById(dto.tourDateId).exec();
            if (check &&
                check.status === tour_date_status_enum_1.TourDateStatus.FULL &&
                check.bookedSeats < check.totalSeats) {
                await this.tourDateModel.findByIdAndUpdate(dto.tourDateId, {
                    status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
                });
            }
            if (error.code === 11000) {
                this.logger.error(`Concurrency error on booking creation: duplicated booking number ${bNo}`);
                throw new common_1.ConflictException('Concurrency error during booking. Please try again.');
            }
            throw error;
        }
        this.logger.log(`Booking created successfully: #${savedBooking.bookingNumber} (${savedBooking._id})`);
        try {
            await this.notificationsService.createNotification(userId, notification_type_enum_1.NotificationType.BOOKING_CREATED, 'Booking Created', `Your booking #${savedBooking.bookingNumber} has been created successfully!`, { bookingId: savedBooking._id });
        }
        catch (err) {
            this.logger.error(`Failed to create notification for booking ${savedBooking.bookingNumber}`, err.stack);
        }
        return savedBooking.toObject();
    }
    async getMyBookings(userId) {
        const query = { user: userId };
        return this.bookingModel
            .find(query)
            .populate('tour', 'title slug thumbnailImage location')
            .populate('tourDate', 'startDate endDate status totalSeats bookedSeats')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getBookingById(id, userId) {
        const query = { _id: id };
        if (userId)
            query.user = userId;
        const booking = await this.bookingModel
            .findOne(query)
            .populate('user', 'name email phone')
            .populate('tour', 'title slug location category thumbnailImage')
            .populate('tourDate', 'startDate endDate status totalSeats bookedSeats')
            .exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking.toObject({ virtuals: true });
    }
    async adminGetAllBookings(filters = {}) {
        const { search, status, startDate, endDate, page = 1, limit = 10, } = filters;
        const query = {};
        if (status)
            query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }
        if (search)
            query.bookingNumber = { $regex: search, $options: 'i' };
        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            this.bookingModel
                .find(query)
                .populate('user', 'name email')
                .populate('tour', 'title thumbnailImage')
                .populate('tourDate', 'startDate endDate')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .exec(),
            this.bookingModel.countDocuments(query),
        ]);
        return {
            items,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        };
    }
    async adminUpdateStatus(id, status, note, adminId) {
        const oldBooking = await this.bookingModel.findById(id).exec();
        if (!oldBooking)
            throw new common_1.NotFoundException('Booking not found');
        const oldStatus = oldBooking.status;
        const newStatus = status.toUpperCase();
        if (oldStatus !== booking_status_enum_1.BookingStatus.CANCELLED &&
            newStatus === booking_status_enum_1.BookingStatus.CANCELLED) {
            const restoredDate = await this.tourDateModel
                .findByIdAndUpdate(oldBooking.tourDate, { $inc: { bookedSeats: -oldBooking.totalTravelers } }, { returnDocument: 'after' })
                .exec();
            if (restoredDate &&
                restoredDate.status === tour_date_status_enum_1.TourDateStatus.FULL &&
                restoredDate.bookedSeats < restoredDate.totalSeats) {
                await this.tourDateModel.findByIdAndUpdate(oldBooking.tourDate, {
                    status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
                });
            }
        }
        else if (oldStatus === booking_status_enum_1.BookingStatus.CANCELLED &&
            newStatus !== booking_status_enum_1.BookingStatus.CANCELLED) {
            const updatedDate = await this.tourDateModel
                .findOneAndUpdate({
                _id: oldBooking.tourDate,
                $expr: {
                    $gte: [
                        { $subtract: ['$totalSeats', '$bookedSeats'] },
                        oldBooking.totalTravelers,
                    ],
                },
            }, { $inc: { bookedSeats: oldBooking.totalTravelers } }, { returnDocument: 'after' })
                .exec();
            if (!updatedDate)
                throw new common_1.BadRequestException('Cannot revert cancellation: Not enough seats available on this tour date.');
            if (updatedDate.bookedSeats >= updatedDate.totalSeats) {
                await this.tourDateModel.findByIdAndUpdate(oldBooking.tourDate, {
                    status: tour_date_status_enum_1.TourDateStatus.FULL,
                });
            }
        }
        const updateOp = { status: newStatus };
        if (note) {
            updateOp.$push = {
                internalNotes: {
                    note,
                    createdAt: new Date(),
                    adminId: adminId || null,
                },
            };
        }
        const booking = await this.bookingModel
            .findByIdAndUpdate(id, updateOp, { returnDocument: 'after' })
            .populate('user', 'name email')
            .exec();
        return booking;
    }
    async adminUpdatePaidAmount(id, amount) {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        booking.paidAmount += amount;
        booking.pendingAmount = Math.max(0, booking.totalAmount - booking.paidAmount);
        return booking.save();
    }
    async syncBookingReceiptInfo(id, receiptImage, transactionId) {
        return this.bookingModel
            .findByIdAndUpdate(id, { receiptImage, transactionId }, { returnDocument: 'after' })
            .exec();
    }
    async markPaymentVerified(id) {
        return this.bookingModel
            .findByIdAndUpdate(id, {
            paymentVerifiedAt: new Date(),
            receiptImage: null,
            transactionId: null,
        }, { returnDocument: 'after' })
            .exec();
    }
    async adminUpdatePaymentTypeAndNote(id, paymentType, note, adminId) {
        const updateOp = { paymentType };
        if (note) {
            updateOp.$push = {
                internalNotes: {
                    note,
                    createdAt: new Date(),
                    adminId: adminId || null,
                },
            };
        }
        return this.bookingModel
            .findByIdAndUpdate(id, updateOp, { returnDocument: 'after' })
            .exec();
    }
    async adminCancelBooking(id) {
        return this.cancelBooking(id);
    }
    async adminVerifyReceipt(id, approve, adminId) {
        const booking = await this.bookingModel
            .findById(id)
            .populate('user')
            .populate('tour')
            .exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (approve) {
            booking.paymentVerifiedAt = new Date();
            booking.paidAmount = booking.totalAmount;
            booking.pendingAmount = 0;
            await booking.save();
            await this.adminConfirmBooking(id);
            this.logger.log(`Receipt approved and booking confirmed: #${booking.bookingNumber}`);
        }
        else {
            await this.bookingModel
                .findByIdAndUpdate(id, {
                status: booking_status_enum_1.BookingStatus.PENDING,
                receiptImage: null,
                transactionId: null,
                $push: {
                    internalNotes: {
                        note: 'Payment receipt was rejected by admin.',
                        createdAt: new Date(),
                        adminId: adminId || null,
                    },
                },
            })
                .exec();
            this.logger.log(`Receipt rejected for booking: #${booking.bookingNumber}`);
            const uId = booking.user?._id?.toString() ||
                booking.user?.toString();
            if (uId) {
                try {
                    await this.notificationsService.createNotification(uId, notification_type_enum_1.NotificationType.PAYMENT_FAILED, 'Payment Receipt Rejected', `Your payment receipt for booking #${booking.bookingNumber} was rejected. Please re-upload a valid receipt.`, { bookingId: booking._id });
                }
                catch (err) {
                    this.logger.error(`Failed to notify user on receipt rejection: ${booking.bookingNumber}`, err.stack);
                }
            }
        }
        return this.bookingModel
            .findById(id)
            .populate('user', 'name email')
            .populate('tour')
            .populate('tourDate')
            .exec();
    }
    async adminConfirmBooking(id) {
        this.logger.log(`Admin confirming booking: ${id}`);
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status === booking_status_enum_1.BookingStatus.CONFIRMED)
            return booking;
        if (booking.paidAmount === 0 && !booking.paymentType) {
            booking.paymentType = booking_status_enum_1.PaymentType.OFFLINE;
        }
        booking.status = booking_status_enum_1.BookingStatus.CONFIRMED;
        const savedBooking = await booking.save();
        const populatedBooking = await this.bookingModel
            .findById(booking._id)
            .populate('user')
            .populate('tour')
            .populate('tourDate')
            .exec();
        if (populatedBooking && populatedBooking.user) {
            try {
                await this.notificationsService.createNotification(populatedBooking.user._id.toString(), notification_type_enum_1.NotificationType.BOOKING_CONFIRMED, 'Booking Confirmed', `Your booking #${populatedBooking.bookingNumber} has been confirmed!`, { bookingId: populatedBooking._id });
                await this.notificationsService.sendEmail(populatedBooking.user.email, 'Booking Confirmed', notification_type_enum_1.NotificationType.BOOKING_CONFIRMED, {
                    name: populatedBooking.user.name,
                    bookingNumber: populatedBooking.bookingNumber,
                    tourTitle: populatedBooking.tour?.title,
                    startDate: populatedBooking.tourDate?.startDate,
                    amount: populatedBooking.totalAmount,
                });
            }
            catch (err) {
                this.logger.error(`Failed to dispatch confirm notification for booking ${populatedBooking.bookingNumber}`, err.stack);
            }
        }
        this.logger.log(`Booking confirmed successfully: #${savedBooking.bookingNumber}`);
        return savedBooking;
    }
    async cancelBooking(id, userId) {
        this.logger.log(`Cancelling booking: ${id} (User: ${userId || 'Admin'})`);
        const query = { _id: id };
        if (userId)
            query.user = userId;
        const booking = await this.bookingModel
            .findOne(query)
            .populate('user')
            .populate('tour')
            .exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status === booking_status_enum_1.BookingStatus.CANCELLED)
            return booking;
        const restoredDate = await this.tourDateModel
            .findByIdAndUpdate(booking.tourDate, { $inc: { bookedSeats: -booking.totalTravelers } }, { returnDocument: 'after' })
            .exec();
        if (restoredDate &&
            restoredDate.status === tour_date_status_enum_1.TourDateStatus.FULL &&
            restoredDate.bookedSeats < restoredDate.totalSeats) {
            await this.tourDateModel.findByIdAndUpdate(booking.tourDate, {
                status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
            });
            this.logger.log(`Tour date ${booking.tourDate} reverted from FULL to UPCOMING after cancellation of booking ${id}`);
        }
        booking.status = booking_status_enum_1.BookingStatus.CANCELLED;
        if (booking.couponCode) {
            await this.couponsService.releaseCoupon(booking.couponCode);
        }
        if (booking.paidAmount > 0) {
            booking.refundStatus = booking_status_enum_1.RefundStatus.REQUESTED;
            booking.refundReason = 'Auto-requested on booking cancellation';
            booking.refundRequestedAt = new Date();
        }
        const savedBooking = await booking.save();
        this.logger.log(`Booking cancelled successfully: #${savedBooking.bookingNumber}`);
        try {
            const uId = booking.user?._id?.toString() ||
                booking.user?.toString();
            if (uId) {
                await this.notificationsService.createNotification(uId, notification_type_enum_1.NotificationType.BOOKING_CANCELLED, 'Booking Cancelled', `Your booking #${booking.bookingNumber} has been cancelled successfully.`, { bookingId: booking._id });
                if (booking.user.email) {
                    await this.notificationsService.sendEmail(booking.user.email, 'Booking Cancelled', notification_type_enum_1.NotificationType.GENERAL, {
                        name: booking.user.name,
                        message: `Your booking #${booking.bookingNumber} for ${booking.tour.title} has been cancelled.`,
                    });
                }
            }
        }
        catch (err) {
            this.logger.error(`Failed to dispatch cancel notification for booking ${booking.bookingNumber}`, err.stack);
        }
        return savedBooking;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(tour_schema_1.Tour.name)),
    __param(2, (0, mongoose_1.InjectModel)(tour_date_schema_1.TourDate.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        coupons_service_1.CouponsService,
        notifications_service_1.NotificationsService,
        settings_service_1.SettingsService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map