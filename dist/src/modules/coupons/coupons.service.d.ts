import { Model } from 'mongoose';
import { Coupon, CouponDocument } from '../../database/schemas/coupon.schema';
import { BookingDocument } from '../../database/schemas/booking.schema';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
export declare class CouponsService {
    private couponModel;
    private bookingModel;
    constructor(couponModel: Model<CouponDocument>, bookingModel: Model<BookingDocument>);
    create(createCouponDto: CreateCouponDto): Promise<Coupon>;
    findAll(filters?: any, paginationQuery?: PaginationQuery): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    findOne(id: string): Promise<Coupon>;
    update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon>;
    remove(id: string): Promise<void>;
    validateCoupon(code: string, userId: string, tourId: string, orderAmount: number): Promise<{
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
    applyCoupon(code: string): Promise<(import("mongoose").Document<unknown, {}, CouponDocument, {}, import("mongoose").DefaultSchemaOptions> & Coupon & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    releaseCoupon(code: string): Promise<(import("mongoose").Document<unknown, {}, CouponDocument, {}, import("mongoose").DefaultSchemaOptions> & Coupon & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getCouponUsage(id: string, pagination: any): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
}
