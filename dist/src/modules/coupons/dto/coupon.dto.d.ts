export declare class CreateCouponDto {
    code: string;
    description?: string;
    discountType: string;
    discountValue: number;
    maxDiscountAmount?: number;
    expiryDate?: string;
    maxUsage?: number;
    maxUsagePerUser?: number;
    minOrderAmount?: number;
    applicableTours?: string[];
    isActive?: boolean;
}
export declare class UpdateCouponDto {
    code?: string;
    description?: string;
    discountType?: string;
    discountValue?: number;
    maxDiscountAmount?: number;
    expiryDate?: string;
    maxUsage?: number;
    maxUsagePerUser?: number;
    minOrderAmount?: number;
    applicableTours?: string[];
    isActive?: boolean;
}
export declare class ValidateCouponDto {
    code: string;
    tourId: string;
    orderAmount: number;
}
