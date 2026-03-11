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
exports.ReviewSchema = exports.Review = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_status_enum_1 = require("../../common/enums/review-status.enum");
const user_schema_1 = require("../schemas/user.schema");
const tour_schema_1 = require("../schemas/tour.schema");
const booking_schema_1 = require("../schemas/booking.schema");
let Review = class Review {
    user;
    tour;
    booking;
    rating;
    comment;
    status;
    adminNote;
};
exports.Review = Review;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", user_schema_1.User)
], Review.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Tour', required: true }),
    __metadata("design:type", tour_schema_1.Tour)
], Review.prototype, "tour", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        unique: true,
    }),
    __metadata("design:type", booking_schema_1.Booking)
], Review.prototype, "booking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 5 }),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: Object.values(review_status_enum_1.ReviewStatus),
        default: review_status_enum_1.ReviewStatus.PENDING,
        uppercase: true,
        trim: true,
        index: true,
    }),
    __metadata("design:type", String)
], Review.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Review.prototype, "adminNote", void 0);
exports.Review = Review = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Review);
exports.ReviewSchema = mongoose_1.SchemaFactory.createForClass(Review);
exports.ReviewSchema.index({ tour: 1, status: 1 });
//# sourceMappingURL=review.schema.js.map