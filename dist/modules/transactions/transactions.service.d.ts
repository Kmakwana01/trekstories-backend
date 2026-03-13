import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../../database/schemas/transaction.schema';
import { UserDocument } from '../../database/schemas/user.schema';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class TransactionsService {
    private transactionModel;
    private userModel;
    private readonly bookingsService;
    private readonly notificationsService;
    private readonly logger;
    constructor(transactionModel: Model<TransactionDocument>, userModel: Model<UserDocument>, bookingsService: BookingsService, notificationsService: NotificationsService);
    createTransaction(dto: Partial<Transaction>): Promise<import("mongoose").Document<unknown, {}, TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getUserTransactions(userId: string): Promise<(import("mongoose").Document<unknown, {}, TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getTransactionById(id: string, userId?: string): Promise<(import("mongoose").Document<unknown, {}, TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getAllTransactions(filters?: any, paginationQuery?: PaginationQuery): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    exportToCSV(filters?: any): Promise<Buffer>;
    submitPaymentProof(userId: string, dto: any): Promise<import("mongoose").Document<unknown, {}, TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    approvePayment(transactionId: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectPayment(transactionId: string, adminId: string, reason: string): Promise<import("mongoose").Document<unknown, {}, TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    recordOfflinePayment(adminId: string, dto: any): Promise<import("mongoose").Document<unknown, {}, TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyBookingPaymentHistory(bookingId: string, userId?: string): Promise<{
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
        paymentType: string;
        payments: (import("mongoose").Document<unknown, {}, TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
}
