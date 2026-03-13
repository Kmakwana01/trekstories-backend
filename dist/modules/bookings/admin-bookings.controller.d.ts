import { BookingsService } from './bookings.service';
import { AdminLogService } from '../admin/services/admin-log.service';
import { TransactionsService } from '../transactions/transactions.service';
export declare class AdminBookingsController {
    private readonly bookingsService;
    private readonly adminLogService;
    private readonly transactionsService;
    constructor(bookingsService: BookingsService, adminLogService: AdminLogService, transactionsService: TransactionsService);
    getPaymentHistory(id: string): Promise<{
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
        paymentType: string;
        payments: (import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getAllBookings(filters: any): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    getBookingById(id: string): Promise<{
        paymentSummary: {
            totalAmount: number;
            paidAmount: number;
            pendingAmount: number;
            paymentType: string;
            payments: (import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            })[];
        };
        bookingNumber: string;
        user: import("mongoose").Schema.Types.ObjectId;
        tour: import("mongoose").Schema.Types.ObjectId;
        tourDate: import("mongoose").Schema.Types.ObjectId;
        pickupOption: import("../../database/schemas/tour.schema").PickupPoint;
        travelers: {
            fullName: string;
            age: number;
            gender: string;
            phone: string;
            idNumber: string;
        }[];
        totalTravelers: number;
        baseAmount: number;
        discountAmount: number;
        couponCode: string;
        totalAmount: number;
        taxAmount: number;
        taxRate: number;
        perPersonPrice: number;
        paidAmount: number;
        pendingAmount: number;
        paymentType: string;
        status: string;
        additionalRequests: string;
        paymentVerifiedAt: Date;
        internalNotes: {
            note: string;
            createdAt: Date;
            adminId: import("mongoose").Schema.Types.ObjectId;
        }[];
        pricingSummary: string;
        refundStatus: string;
        refundAdminNote: string;
        refundAmount: number;
        refundReason: string;
        refundRequestedAt: Date;
        refundProcessedAt: Date;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    updateStatus(id: string, status: string, internalNotes: string, adminId: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    confirmBooking(id: string, adminId: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    cancelBooking(id: string, adminId: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    verifyReceipt(id: string, approve: boolean, adminId: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    addPayment(id: string, amount: number, adminId: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
