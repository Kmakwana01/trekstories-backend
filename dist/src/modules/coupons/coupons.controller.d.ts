import { CouponsService } from './coupons.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';
import { AdminLogService } from '../admin/services/admin-log.service';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    validate(dto: ValidateCouponDto, user: any): Promise<{
        valid: boolean;
        discountAmount: number;
        finalAmount: number;
        coupon: {
            _id: import("mongoose").Types.ObjectId;
            code: string;
            discountType: string;
            discountValue: number;
        };
    }>;
}
export declare class AdminCouponsController {
    private readonly couponsService;
    private readonly adminLogService;
    constructor(couponsService: CouponsService, adminLogService: AdminLogService);
    create(dto: CreateCouponDto, adminId: string, req: any): Promise<import("../../database/schemas/coupon.schema").Coupon>;
    findAll(query: PaginationQuery): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    findOne(id: string): Promise<import("../../database/schemas/coupon.schema").Coupon>;
    update(id: string, dto: UpdateCouponDto, adminId: string, req: any): Promise<import("../../database/schemas/coupon.schema").Coupon>;
    remove(id: string, adminId: string, req: any): Promise<{
        message: string;
    }>;
    getUsage(id: string, query: any): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
}
