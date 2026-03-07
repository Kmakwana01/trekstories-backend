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
exports.PaymentSchema = exports.Payment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_status_enum_1 = require("../../common/enums/payment-status.enum");
let Payment = class Payment {
    booking;
    user;
    method;
    paymentMethod;
    transactionId;
    paymentReceiptImage;
    verifiedBy;
    verifiedAt;
    offlineCollectedBy;
    offlineCollectedAt;
    offlineReceiptNumber;
    amount;
    currency;
    status;
    rejectionReason;
    paidAt;
    metadata;
};
exports.Payment = Payment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Booking', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Payment.prototype, "booking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Payment.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(payment_status_enum_1.PaymentMethod),
        uppercase: true,
        trim: true
    }),
    __metadata("design:type", String)
], Payment.prototype, "method", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "paymentReceiptImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Payment.prototype, "verifiedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payment.prototype, "verifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Payment.prototype, "offlineCollectedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payment.prototype, "offlineCollectedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "offlineReceiptNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'INR' }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(payment_status_enum_1.PaymentStatus),
        default: payment_status_enum_1.PaymentStatus.PENDING,
        uppercase: true,
        trim: true,
        index: true,
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payment.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], Payment.prototype, "metadata", void 0);
exports.Payment = Payment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Payment);
exports.PaymentSchema = mongoose_1.SchemaFactory.createForClass(Payment);
//# sourceMappingURL=payment.schema.js.map