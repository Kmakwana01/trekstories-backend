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
exports.TourSchema = exports.Tour = exports.PickupPointSchema = exports.PickupPoint = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const tour_category_enum_1 = require("../../common/enums/tour-category.enum");
const pickup_type_enum_1 = require("../../common/enums/pickup-type.enum");
let ItineraryPoint = class ItineraryPoint {
    text;
    subPoints;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ItineraryPoint.prototype, "text", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], ItineraryPoint.prototype, "subPoints", void 0);
ItineraryPoint = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ItineraryPoint);
const ItineraryPointSchema = mongoose_1.SchemaFactory.createForClass(ItineraryPoint);
let ItineraryDay = class ItineraryDay {
    dayNumber;
    title;
    points;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ItineraryDay.prototype, "dayNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ItineraryDay.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ItineraryPointSchema], required: true }),
    __metadata("design:type", Array)
], ItineraryDay.prototype, "points", void 0);
ItineraryDay = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ItineraryDay);
const ItineraryDaySchema = mongoose_1.SchemaFactory.createForClass(ItineraryDay);
let PickupPoint = class PickupPoint {
    fromCity;
    toCity;
    type;
    departureTimeAndPlace;
    totalDays;
    totalNights;
    priceAdjustment;
};
exports.PickupPoint = PickupPoint;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PickupPoint.prototype, "fromCity", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PickupPoint.prototype, "toCity", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(pickup_type_enum_1.PickupType),
        uppercase: true,
        trim: true
    }),
    __metadata("design:type", String)
], PickupPoint.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PickupPoint.prototype, "departureTimeAndPlace", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], PickupPoint.prototype, "totalDays", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], PickupPoint.prototype, "totalNights", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], PickupPoint.prototype, "priceAdjustment", void 0);
exports.PickupPoint = PickupPoint = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PickupPoint);
exports.PickupPointSchema = mongoose_1.SchemaFactory.createForClass(PickupPoint);
let FAQ = class FAQ {
    question;
    answer;
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FAQ.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FAQ.prototype, "answer", void 0);
FAQ = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FAQ);
const FAQSchema = mongoose_1.SchemaFactory.createForClass(FAQ);
let Tour = class Tour {
    title;
    slug;
    description;
    duration;
    basePrice;
    minAge;
    maxAge;
    category;
    location;
    state;
    country;
    highlights;
    departureOptions;
    itinerary;
    inclusions;
    exclusions;
    faqs;
    images;
    thumbnailImage;
    isActive;
    isFeatured;
    viewCount;
    averageRating;
    reviewCount;
    isDeleted;
    deletedAt;
    brochureUrl;
};
exports.Tour = Tour;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tour.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Tour.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], Tour.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Tour.prototype, "basePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Tour.prototype, "minAge", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Tour.prototype, "maxAge", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        enum: Object.values(tour_category_enum_1.TourCategory),
        uppercase: true,
        trim: true,
        index: true
    }),
    __metadata("design:type", String)
], Tour.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tour.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    __metadata("design:type", String)
], Tour.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Tour.prototype, "highlights", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.PickupPointSchema] }),
    __metadata("design:type", Array)
], Tour.prototype, "departureOptions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ItineraryDaySchema] }),
    __metadata("design:type", Array)
], Tour.prototype, "itinerary", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Tour.prototype, "inclusions", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Tour.prototype, "exclusions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FAQSchema] }),
    __metadata("design:type", Array)
], Tour.prototype, "faqs", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Tour.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "thumbnailImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], Tour.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Tour.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Tour.prototype, "viewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Tour.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Tour.prototype, "reviewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], Tour.prototype, "isDeleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Tour.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "brochureUrl", void 0);
exports.Tour = Tour = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Tour);
exports.TourSchema = mongoose_1.SchemaFactory.createForClass(Tour);
exports.TourSchema.index({ isActive: 1, isFeatured: 1 });
exports.TourSchema.index({ isDeleted: 1 });
//# sourceMappingURL=tour.schema.js.map