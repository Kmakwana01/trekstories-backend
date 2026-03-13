import { TransactionsService } from './transactions.service';
import { ImageUploadService } from '../../common/services/image-upload.service';
export declare class TransactionsController {
    private readonly transactionsService;
    private readonly imageUploadService;
    constructor(transactionsService: TransactionsService, imageUploadService: ImageUploadService);
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
    submitPaymentProof(userId: string, file: Express.Multer.File, dto: {
        bookingId: string;
        transactionId: string;
        paymentMethod: string;
        paymentAmount?: string | number;
    }): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/transaction.schema").TransactionDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/transaction.schema").Transaction & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
