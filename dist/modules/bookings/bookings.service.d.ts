import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { TourDocument } from '../../database/schemas/tour.schema';
import { TourDateDocument } from '../../database/schemas/tour-date.schema';
import { PreviewBookingDto } from './dto/preview-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CouponsService } from '../coupons/coupons.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
export declare class BookingsService {
    private bookingModel;
    private tourModel;
    private tourDateModel;
    private readonly couponsService;
    private readonly notificationsService;
    private readonly settingsService;
    private readonly logger;
    constructor(bookingModel: Model<BookingDocument>, tourModel: Model<TourDocument>, tourDateModel: Model<TourDateDocument>, couponsService: CouponsService, notificationsService: NotificationsService, settingsService: SettingsService);
    previewBooking(dto: PreviewBookingDto): Promise<{
        baseAmount: number;
        perPersonPrice: number;
        subtotal: number;
        couponDiscount: number;
        taxAmount: number;
        taxRate: number;
        totalAmount: number;
        appliedCoupon: any;
        pickupOption: import("../../database/schemas/tour.schema").PickupPoint;
        pricingSummary: string;
    }>;
    getUpcomingDepartures(startDate: Date, endDate: Date): Promise<Booking[]>;
    createBooking(userId: string, dto: CreateBookingDto): Promise<any>;
    getMyBookings(userId: string): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getBookingById(id: string, userId?: string): Promise<Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    adminGetAllBookings(filters?: any): Promise<{
        items: (import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    adminUpdateStatus(id: string, status: string, note?: string, adminId?: string): Promise<import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    adminUpdatePaidAmount(id: string, amount: number): Promise<import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    syncBookingReceiptInfo(id: string, receiptImage: string, transactionId: string, paymentType: string): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    markPaymentVerified(id: string): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    adminCancelBooking(id: string): Promise<import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    adminVerifyReceipt(id: string, approve: boolean, adminId?: string): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    adminConfirmBooking(id: string): Promise<import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    cancelBooking(id: string, userId?: string): Promise<import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
