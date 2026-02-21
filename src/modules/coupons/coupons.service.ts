import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from '../../database/schemas/coupon.schema';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { paginate } from '../../common/helpers/pagination.helper';

@Injectable()
export class CouponsService {
    constructor(
        @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    ) { }

    async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
        const existing = await this.couponModel.findOne({ code: createCouponDto.code.toUpperCase() }).exec();
        if (existing)
        {
            throw new ConflictException('Coupon code already exists');
        }

        const coupon = new this.couponModel({
            ...createCouponDto,
            code: createCouponDto.code.toUpperCase(),
        });
        return coupon.save();
    }

    async findAll(filters: any = {}): Promise<Coupon[]> {
        return this.couponModel.find(filters).sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Coupon> {
        const coupon = await this.couponModel.findById(id).exec();
        if (!coupon)
        {
            throw new NotFoundException('Coupon not found');
        }
        return coupon;
    }

    async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
        const updateData = { ...updateCouponDto };
        if (updateData.code)
        {
            updateData.code = updateData.code.toUpperCase();
        }

        const coupon = await this.couponModel.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).exec();
        if (!coupon)
        {
            throw new NotFoundException('Coupon not found');
        }
        return coupon;
    }

    async remove(id: string): Promise<void> {
        const result = await this.couponModel.findByIdAndDelete(id).exec();
        if (!result)
        {
            throw new NotFoundException('Coupon not found');
        }
    }

    async validateCoupon(code: string, userId: string, tourId: string, orderAmount: number) {
        const coupon = await this.couponModel.findOne({ code: code.toUpperCase(), isActive: true }).exec();

        if (!coupon)
        {
            throw new BadRequestException('Invalid or inactive coupon code');
        }

        const now = new Date();
        if (coupon.expiryDate && coupon.expiryDate < now)
        {
            throw new BadRequestException('Coupon has expired');
        }

        if (coupon.maxUsage !== undefined && coupon.usedCount >= coupon.maxUsage)
        {
            throw new BadRequestException('Coupon usage limit reached');
        }

        if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount)
        {
            throw new BadRequestException(`Minimum order amount for this coupon is ${coupon.minOrderAmount}`);
        }

        if (coupon.applicableTours && coupon.applicableTours.length > 0)
        {
            const isApplicable = coupon.applicableTours.some(t => t.toString() === tourId);
            if (!isApplicable)
            {
                throw new BadRequestException('Coupon is not applicable for this tour');
            }
        }

        // Check per-user usage
        if (coupon.maxUsagePerUser && userId)
        {
            const userUsageCount = await this.bookingModel.countDocuments({
                user: userId as any,
                couponCode: code.toUpperCase(),
                status: { $ne: 'cancelled' }
            });

            if (userUsageCount >= coupon.maxUsagePerUser)
            {
                throw new BadRequestException('You have already reached the maximum usage limit for this coupon');
            }
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percent')
        {
            discountAmount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount)
            {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
        } else
        {
            discountAmount = Math.min(coupon.discountValue, orderAmount);
        }

        return {
            valid: true,
            discountAmount,
            finalAmount: orderAmount - discountAmount,
            coupon: {
                _id: coupon._id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            }
        };
    }

    async applyCoupon(code: string) {
        return this.couponModel.findOneAndUpdate(
            { code: code.toUpperCase() },
            { $inc: { usedCount: 1 } },
            { returnDocument: 'after' }
        ).exec();
    }

    async releaseCoupon(code: string) {
        return this.couponModel.findOneAndUpdate(
            { code: code.toUpperCase() },
            { $inc: { usedCount: -1 } },
            { returnDocument: 'after' }
        ).exec();
    }

    async getCouponUsage(id: string, pagination: any) {
        const coupon = await this.findOne(id);
        return paginate(
            this.bookingModel,
            { couponCode: coupon.code, status: { $ne: 'cancelled' } },
            pagination
        );
    }
}
