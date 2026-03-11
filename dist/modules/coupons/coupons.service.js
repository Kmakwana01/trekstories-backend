"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const coupon_schema_1 = require("../../database/schemas/coupon.schema");
const booking_schema_1 = require("../../database/schemas/booking.schema");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
const date_util_1 = require("../../utils/date.util");
const coupon_enum_1 = require("../../common/enums/coupon.enum");
const booking_status_enum_1 = require("../../common/enums/booking-status.enum");
let CouponsService = class CouponsService {
    couponModel;
    bookingModel;
    constructor(couponModel, bookingModel) {
        this.couponModel = couponModel;
        this.bookingModel = bookingModel;
    }
    async create(createCouponDto) {
        const existing = await this.couponModel
            .findOne({ code: createCouponDto.code.toUpperCase() })
            .exec();
        if (existing) {
            throw new common_1.ConflictException('Coupon code already exists');
        }
        const coupon = new this.couponModel({
            ...createCouponDto,
            code: createCouponDto.code.toUpperCase(),
            expiryDate: createCouponDto.expiryDate
                ? date_util_1.DateUtil.parseISTToUTC(createCouponDto.expiryDate)
                : undefined,
        });
        return coupon.save();
    }
    async findAll(filters = {}, paginationQuery = {}) {
        if (!paginationQuery.order)
            paginationQuery.order = 'desc';
        return (0, pagination_helper_1.paginate)(this.couponModel, filters, paginationQuery);
    }
    async findOne(id) {
        const coupon = await this.couponModel.findById(id).exec();
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        return coupon;
    }
    async update(id, updateCouponDto) {
        const updateData = { ...updateCouponDto };
        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
        }
        if (updateData.expiryDate) {
            updateData.expiryDate = date_util_1.DateUtil.parseISTToUTC(updateData.expiryDate);
        }
        const coupon = await this.couponModel
            .findByIdAndUpdate(id, updateData, { returnDocument: 'after' })
            .exec();
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        return coupon;
    }
    async remove(id) {
        const result = await this.couponModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Coupon not found');
        }
    }
    async validateCoupon(code, userId, tourId, orderAmount) {
        const coupon = await this.couponModel
            .findOne({ code: code.toUpperCase(), isActive: true })
            .exec();
        if (!coupon) {
            throw new common_1.BadRequestException('Invalid or inactive coupon code');
        }
        const now = date_util_1.DateUtil.nowUTC();
        if (coupon.expiryDate && coupon.expiryDate < now) {
            throw new common_1.BadRequestException('Coupon has expired');
        }
        if (coupon.maxUsage !== undefined && coupon.usedCount >= coupon.maxUsage) {
            throw new common_1.BadRequestException('Coupon usage limit reached');
        }
        if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
            throw new common_1.BadRequestException(`Minimum order amount for this coupon is ${coupon.minOrderAmount}`);
        }
        if (coupon.applicableTours && coupon.applicableTours.length > 0) {
            const isApplicable = coupon.applicableTours.some((t) => t.toString() === tourId);
            if (!isApplicable) {
                throw new common_1.BadRequestException('Coupon is not applicable for this tour');
            }
        }
        if (coupon.maxUsagePerUser && userId) {
            const userUsageCount = await this.bookingModel.countDocuments({
                user: userId,
                couponCode: code.toUpperCase(),
                status: { $ne: booking_status_enum_1.BookingStatus.CANCELLED },
            });
            if (userUsageCount >= coupon.maxUsagePerUser) {
                throw new common_1.BadRequestException('You have already reached the maximum usage limit for this coupon');
            }
        }
        let discountAmount = 0;
        if (coupon.discountType === coupon_enum_1.CouponType.PERCENT) {
            discountAmount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
        }
        else {
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
                discountValue: coupon.discountValue,
            },
        };
    }
    async applyCoupon(code) {
        return this.couponModel
            .findOneAndUpdate({ code: code.toUpperCase() }, { $inc: { usedCount: 1 } }, { returnDocument: 'after' })
            .exec();
    }
    async releaseCoupon(code) {
        return this.couponModel
            .findOneAndUpdate({ code: code.toUpperCase() }, { $inc: { usedCount: -1 } }, { returnDocument: 'after' })
            .exec();
    }
    async getCouponUsage(id, pagination) {
        const coupon = await this.findOne(id);
        return (0, pagination_helper_1.paginate)(this.bookingModel, { couponCode: coupon.code, status: { $ne: booking_status_enum_1.BookingStatus.CANCELLED } }, pagination);
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(coupon_schema_1.Coupon.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map