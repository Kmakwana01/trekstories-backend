import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../../database/schemas/transaction.schema';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
export declare class TransactionsService {
    private transactionModel;
    constructor(transactionModel: Model<TransactionDocument>);
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
}
