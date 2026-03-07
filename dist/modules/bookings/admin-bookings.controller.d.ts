import { BookingsService } from './bookings.service';
import { AdminLogService } from '../admin/services/admin-log.service';
export declare class AdminBookingsController {
    private readonly bookingsService;
    private readonly adminLogService;
    constructor(bookingsService: BookingsService, adminLogService: AdminLogService);
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
    getBookingById(id: string): Promise<import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStatus(id: string, status: string, internalNotes: string, adminId: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
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
