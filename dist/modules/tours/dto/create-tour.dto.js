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
exports.UpdateTourDto = exports.CreateTourDto = exports.FAQDto = exports.PickupPointDto = exports.ItineraryDayDto = exports.ItineraryPointDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const tour_category_enum_1 = require("../../../common/enums/tour-category.enum");
const pickup_type_enum_1 = require("../../../common/enums/pickup-type.enum");
const ParseJson = (type) => (0, class_transformer_1.Transform)(({ value }) => {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (type) {
                return (0, class_transformer_1.plainToInstance)(type, parsed, {
                    enableImplicitConversion: true,
                    excludeExtraneousValues: false,
                });
            }
            return parsed;
        }
        catch {
            return value;
        }
    }
    if (type && (Array.isArray(value) || (typeof value === 'object' && value !== null))) {
        return (0, class_transformer_1.plainToInstance)(type, value, {
            enableImplicitConversion: true,
            excludeExtraneousValues: false,
        });
    }
    return value;
});
const ParseBoolean = () => (0, class_transformer_1.Transform)(({ value }) => {
    if (value === 'true' || value === true)
        return true;
    if (value === 'false' || value === false)
        return false;
    if (value === '' || value === undefined || value === null)
        return undefined;
    return value;
});
const ParseNumber = () => (0, class_transformer_1.Transform)(({ value }) => {
    if (value === '' || value === null || value === undefined)
        return undefined;
    if (typeof value === 'number' && !isNaN(value))
        return value;
    if (typeof value === 'string') {
        const num = Number(value);
        if (!isNaN(num))
            return num;
    }
    return value;
});
const ParseUppercase = () => (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value);
class ItineraryPointDto {
    text;
    subPoints;
}
exports.ItineraryPointDto = ItineraryPointDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ItineraryPointDto.prototype, "text", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], ItineraryPointDto.prototype, "subPoints", void 0);
class ItineraryDayDto {
    dayNumber;
    title;
    points;
}
exports.ItineraryDayDto = ItineraryDayDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    ParseNumber(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ItineraryDayDto.prototype, "dayNumber", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ItineraryDayDto.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItineraryPointDto),
    __metadata("design:type", Array)
], ItineraryDayDto.prototype, "points", void 0);
class PickupPointDto {
    fromCity;
    toCity;
    type;
    departureTimeAndPlace;
    totalDays;
    totalNights;
    priceAdjustment;
}
exports.PickupPointDto = PickupPointDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Route Start is required' }),
    __metadata("design:type", String)
], PickupPointDto.prototype, "fromCity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PickupPointDto.prototype, "toCity", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    ParseUppercase(),
    (0, class_validator_1.IsEnum)(pickup_type_enum_1.PickupType),
    __metadata("design:type", String)
], PickupPointDto.prototype, "type", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PickupPointDto.prototype, "departureTimeAndPlace", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    ParseNumber(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PickupPointDto.prototype, "totalDays", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    ParseNumber(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PickupPointDto.prototype, "totalNights", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    ParseNumber(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PickupPointDto.prototype, "priceAdjustment", void 0);
class FAQDto {
    question;
    answer;
}
exports.FAQDto = FAQDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Question is required' }),
    __metadata("design:type", String)
], FAQDto.prototype, "question", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Answer is required' }),
    __metadata("design:type", String)
], FAQDto.prototype, "answer", void 0);
class CreateTourDto {
    title;
    description;
    basePrice;
    minAge;
    maxAge;
    category;
    location;
    state;
    duration;
    country;
    highlights;
    departureOptions;
    itinerary;
    inclusions;
    exclusions;
    faqs;
    images;
    thumbnailImage;
    brochureUrl;
    isActive;
    isFeatured;
}
exports.CreateTourDto = CreateTourDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "description", void 0);
__decorate([
    ParseNumber(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "basePrice", void 0);
__decorate([
    ParseNumber(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "minAge", void 0);
__decorate([
    ParseNumber(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "maxAge", void 0);
__decorate([
    ParseUppercase(),
    (0, class_validator_1.IsEnum)(tour_category_enum_1.TourCategory),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "country", void 0);
__decorate([
    ParseJson(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "highlights", void 0);
__decorate([
    ParseJson(PickupPointDto),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PickupPointDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "departureOptions", void 0);
__decorate([
    ParseJson(ItineraryDayDto),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItineraryDayDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "itinerary", void 0);
__decorate([
    ParseJson(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "inclusions", void 0);
__decorate([
    ParseJson(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "exclusions", void 0);
__decorate([
    ParseJson(FAQDto),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FAQDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "faqs", void 0);
__decorate([
    ParseJson(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "thumbnailImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "brochureUrl", void 0);
__decorate([
    ParseBoolean(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateTourDto.prototype, "isActive", void 0);
__decorate([
    ParseBoolean(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateTourDto.prototype, "isFeatured", void 0);
class UpdateTourDto {
    title;
    description;
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
    brochureUrl;
    duration;
    isActive;
    isFeatured;
}
exports.UpdateTourDto = UpdateTourDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDto.prototype, "description", void 0);
__decorate([
    ParseNumber(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTourDto.prototype, "basePrice", void 0);
__decorate([
    ParseNumber(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTourDto.prototype, "minAge", void 0);
__decorate([
    ParseNumber(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateTourDto.prototype, "maxAge", void 0);
__decorate([
    ParseUppercase(),
    (0, class_validator_1.IsEnum)(tour_category_enum_1.TourCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDto.prototype, "country", void 0);
__decorate([
    ParseJson(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateTourDto.prototype, "highlights", void 0);
__decorate([
    ParseJson(PickupPointDto),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PickupPointDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateTourDto.prototype, "departureOptions", void 0);
__decorate([
    ParseJson(ItineraryDayDto),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItineraryDayDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateTourDto.prototype, "itinerary", void 0);
__decorate([
    ParseJson(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateTourDto.prototype, "inclusions", void 0);
__decorate([
    ParseJson(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateTourDto.prototype, "exclusions", void 0);
__decorate([
    ParseJson(FAQDto),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FAQDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateTourDto.prototype, "faqs", void 0);
__decorate([
    ParseJson(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateTourDto.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDto.prototype, "thumbnailImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDto.prototype, "brochureUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDto.prototype, "duration", void 0);
__decorate([
    ParseBoolean(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateTourDto.prototype, "isActive", void 0);
__decorate([
    ParseBoolean(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateTourDto.prototype, "isFeatured", void 0);
//# sourceMappingURL=create-tour.dto.js.map