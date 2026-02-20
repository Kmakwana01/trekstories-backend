import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, IsBoolean, IsArray, IsMongoId, Min, Max } from 'class-validator';

export class CreateCouponDto {
    @IsString()
    code: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsEnum(['percent', 'flat'])
    discountType: string;

    @IsNumber()
    @Min(0)
    discountValue: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    maxDiscountAmount?: number;

    @IsOptional()
    @IsDateString()
    expiryDate?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    maxUsage?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    maxUsagePerUser?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    minOrderAmount?: number;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    applicableTours?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateCouponDto {
    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(['percent', 'flat'])
    discountType?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    discountValue?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    maxDiscountAmount?: number;

    @IsOptional()
    @IsDateString()
    expiryDate?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    maxUsage?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    maxUsagePerUser?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    minOrderAmount?: number;

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    applicableTours?: string[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class ValidateCouponDto {
    @IsString()
    code: string;

    @IsMongoId()
    tourId: string;

    @IsNumber()
    @Min(0)
    orderAmount: number;
}
