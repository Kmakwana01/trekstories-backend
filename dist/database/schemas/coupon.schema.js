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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponSchema = exports.Coupon = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const coupon_enum_1 = require("../../common/enums/coupon.enum");
let Coupon = class Coupon {
    code;
    description;
    discountType;
    discountValue;
    maxDiscountAmount;
    expiryDate;
    maxUsage;
    maxUsagePerUser;
    usedCount;
    minOrderAmount;
    applicableTours;
    isActive;
};
exports.Coupon = Coupon;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, uppercase: true }),
    __metadata("design:type", String)
], Coupon.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Coupon.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(coupon_enum_1.CouponType),
        required: true,
        uppercase: true,
        trim: true
    }),
    __metadata("design:type", String)
], Coupon.prototype, "discountType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Coupon.prototype, "discountValue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Coupon.prototype, "maxDiscountAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Coupon.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Coupon.prototype, "maxUsage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Coupon.prototype, "maxUsagePerUser", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "usedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Coupon.prototype, "minOrderAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Tour' }] }),
    __metadata("design:type", Array)
], Coupon.prototype, "applicableTours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Coupon.prototype, "isActive", void 0);
exports.Coupon = Coupon = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Coupon);
exports.CouponSchema = mongoose_1.SchemaFactory.createForClass(Coupon);
//# sourceMappingURL=coupon.schema.js.map