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
exports.TourDateSchema = exports.TourDate = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tour_date_status_enum_1 = require("../../common/enums/tour-date-status.enum");
let TourDate = class TourDate {
    tour;
    startDate;
    endDate;
    totalSeats;
    bookedSeats;
    priceOverride;
    departureNote;
    status;
};
exports.TourDate = TourDate;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Tour', required: true }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], TourDate.prototype, "tour", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], TourDate.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], TourDate.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TourDate.prototype, "totalSeats", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], TourDate.prototype, "bookedSeats", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], TourDate.prototype, "priceOverride", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TourDate.prototype, "departureNote", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(tour_date_status_enum_1.TourDateStatus),
        default: tour_date_status_enum_1.TourDateStatus.UPCOMING,
        uppercase: true,
        trim: true,
        index: true,
    }),
    __metadata("design:type", String)
], TourDate.prototype, "status", void 0);
exports.TourDate = TourDate = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
], TourDate);
exports.TourDateSchema = mongoose_1.SchemaFactory.createForClass(TourDate);
exports.TourDateSchema.virtual('availableSeats').get(function () {
    return this.totalSeats - this.bookedSeats;
});
//# sourceMappingURL=tour-date.schema.js.map