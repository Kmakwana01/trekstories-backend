import type { Response } from 'express';
import { TransactionsService } from './transactions.service';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    getMyTransactions(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getTransactionById(id: string, userId: string): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    exportTransactions(res: Response, filters: any): Promise<void>;
    getAllTransactions(query: PaginationQuery): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    getAdminTransactionById(id: string): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
