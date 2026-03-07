import { BookingsService } from './bookings.service';
import { PreviewBookingDto } from './dto/preview-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    preview(dto: PreviewBookingDto): Promise<{
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
    create(userId: string, dto: CreateBookingDto): Promise<any>;
    getMyBookings(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getBookingById(userId: string, id: string): Promise<import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    cancelBooking(userId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
