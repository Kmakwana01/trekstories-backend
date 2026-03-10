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
exports.BookingSchema = exports.Booking = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tour_schema_1 = require("./tour.schema");
const booking_status_enum_1 = require("../../common/enums/booking-status.enum");
const gender_enum_1 = require("../../common/enums/gender.enum");
let InternalNote = class InternalNote {
    note;
    createdAt;
    adminId;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InternalNote.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], InternalNote.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], InternalNote.prototype, "adminId", void 0);
InternalNote = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], InternalNote);
const InternalNoteSchema = mongoose_1.SchemaFactory.createForClass(InternalNote);
let Traveler = class Traveler {
    fullName;
    age;
    gender;
    phone;
    idNumber;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Traveler.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Traveler.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(gender_enum_1.Gender),
        uppercase: true,
        trim: true
    }),
    __metadata("design:type", String)
], Traveler.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Traveler.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Traveler.prototype, "idNumber", void 0);
Traveler = __decorate([
    (0, mongoose_1.Schema)()
], Traveler);
const TravelerSchema = mongoose_1.SchemaFactory.createForClass(Traveler);
let Booking = class Booking {
    bookingNumber;
    user;
    tour;
    tourDate;
    pickupOption;
    travelers;
    totalTravelers;
    baseAmount;
    discountAmount;
    couponCode;
    totalAmount;
    taxAmount;
    taxRate;
    perPersonPrice;
    paidAmount;
    pendingAmount;
    paymentType;
    status;
    additionalRequests;
    transactionId;
    receiptImage;
    paymentVerifiedAt;
    internalNotes;
    pricingSummary;
    refundStatus;
    refundAdminNote;
    refundAmount;
    refundReason;
    refundRequestedAt;
    refundProcessedAt;
};
exports.Booking = Booking;
__decorate([
    (0, mongoose_1.Prop)({ unique: true, index: true }),
    __metadata("design:type", String)
], Booking.prototype, "bookingNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Booking.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Tour', required: true, index: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Booking.prototype, "tour", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'TourDate',
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], Booking.prototype, "tourDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: tour_schema_1.PickupPointSchema }),
    __metadata("design:type", tour_schema_1.PickupPoint)
], Booking.prototype, "pickupOption", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TravelerSchema] }),
    __metadata("design:type", Array)
], Booking.prototype, "travelers", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Booking.prototype, "totalTravelers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", Number)
], Booking.prototype, "baseAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "discountAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "couponCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Number)
], Booking.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "taxAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 5 }),
    __metadata("design:type", Number)
], Booking.prototype, "taxRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Booking.prototype, "perPersonPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "paidAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Booking.prototype, "pendingAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(booking_status_enum_1.PaymentType),
        uppercase: true,
        trim: true
    }),
    __metadata("design:type", String)
], Booking.prototype, "paymentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(booking_status_enum_1.BookingStatus),
        default: booking_status_enum_1.BookingStatus.PENDING,
        uppercase: true,
        trim: true,
        index: true,
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "additionalRequests", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "transactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "receiptImage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Booking.prototype, "paymentVerifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [InternalNoteSchema], default: [] }),
    __metadata("design:type", Array)
], Booking.prototype, "internalNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "pricingSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(booking_status_enum_1.RefundStatus),
        default: booking_status_enum_1.RefundStatus.NONE,
        uppercase: true,
        trim: true
    }),
    __metadata("design:type", String)
], Booking.prototype, "refundStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "refundAdminNote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "refundAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "refundReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Booking.prototype, "refundRequestedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Booking.prototype, "refundProcessedAt", void 0);
exports.Booking = Booking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Booking);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
//# sourceMappingURL=booking.schema.js.map