import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { TransactionDocument } from '../../database/schemas/transaction.schema';
import { NotificationsService } from '../notifications/notifications.service';
export declare class RefundsService {
    private bookingModel;
    private transactionModel;
    private notificationsService;
    constructor(bookingModel: Model<BookingDocument>, transactionModel: Model<TransactionDocument>, notificationsService: NotificationsService);
    requestRefund(userId: string, bookingId: string, reason: string): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    adminApproveRefund(adminId: string, bookingId: string, refundAmount: number, refundAdminNote: string): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    adminRejectRefund(adminId: string, bookingId: string, reason: string): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    markRefundProcessed(adminId: string, bookingId: string): Promise<{
        message: string;
        booking: import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getRefundRequests(query: any): Promise<{
        items: (import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
}
