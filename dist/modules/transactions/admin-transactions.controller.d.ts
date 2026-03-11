import type { Response } from 'express';
import { TransactionsService } from './transactions.service';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
declare class AdminTransactionFilterDto extends PaginationQuery {
    type?: string;
    status?: string;
}
export declare class AdminTransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    getPendingReceipts(query: any): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    exportTransactions(res: Response, filters: any): Promise<void>;
    getAllTransactions(query: AdminTransactionFilterDto): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    getAdminTransactionById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    approveReceipt(id: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectReceipt(id: string, reason: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    recordOfflinePayment(adminId: string, dto: {
        bookingId: string;
        amount: number;
        paymentMethod: string;
        notes?: string;
        receiptNumber?: string;
        collectedAt?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
export {};
