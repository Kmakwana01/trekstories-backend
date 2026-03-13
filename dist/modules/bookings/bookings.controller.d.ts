import { BookingsService } from './bookings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { PreviewBookingDto } from './dto/preview-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    private readonly transactionsService;
    constructor(bookingsService: BookingsService, transactionsService: TransactionsService);
    preview(dto: PreviewBookingDto): Promise<{
        baseAmount: number;
        perPersonPrice: number;
        subtotal: number;
        couponDiscount: number;
        taxAmount: number;
        taxRate: number;
        totalAmount: number;
        halfAmount: number;
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
    getBookingById(userId: string, id: string): Promise<any>;
    cancelBooking(userId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getPaymentSummary(userId: string, id: string): Promise<{
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
        paymentType: string;
    }>;
}
