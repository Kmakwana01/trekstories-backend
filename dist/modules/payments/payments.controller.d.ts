import { PaymentsService } from './payments.service';
import { ImageUploadService } from '../../common/services/image-upload.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly imageUploadService;
    constructor(paymentsService: PaymentsService, imageUploadService: ImageUploadService);
    submitPaymentProof(userId: string, dto: any, file: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("../../database/schemas/payment.schema").PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getMyPayments(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas/payment.schema").PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getPaymentById(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas/payment.schema").PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getMyBookingPaymentHistory(userId: string, bookingId: string): Promise<{
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
        paymentType: string;
        payments: (import("mongoose").Document<unknown, {}, import("../../database/schemas/payment.schema").PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
}
