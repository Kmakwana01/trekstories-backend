import { RefundsService } from './refunds.service';
import { RequestRefundDto, ApproveRefundDto, RejectRefundDto } from './dto/refund.dto';
export declare class RefundsController {
    private readonly refundsService;
    constructor(refundsService: RefundsService);
    requestRefund(req: any, body: RequestRefundDto & {
        bookingId: string;
    }): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getRefundRequests(query: any): Promise<{
        items: (import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    approveRefund(req: any, bookingId: string, body: ApproveRefundDto): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    rejectRefund(req: any, bookingId: string, body: RejectRefundDto): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    markRefundProcessed(req: any, bookingId: string): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, import("../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
