import { PaymentsService } from '../payments.service';
import { AdminLogService } from '../../admin/services/admin-log.service';
import { PaginationQuery } from '../../../common/helpers/pagination.helper';
export declare class AdminPaymentsController {
    private readonly paymentsService;
    private readonly adminLogService;
    constructor(paymentsService: PaymentsService, adminLogService: AdminLogService);
    getPendingPayments(query: PaginationQuery): Promise<import("../../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    approvePayment(id: string, adminId: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../../database/schemas/payment.schema").PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../../database/schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectPayment(id: string, adminId: string, reason: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../../database/schemas/payment.schema").PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../../database/schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    recordOfflinePayment(adminId: string, dto: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../../database/schemas/payment.schema").PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../../database/schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
