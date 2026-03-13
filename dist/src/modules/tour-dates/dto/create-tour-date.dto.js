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
exports.UpdateTourDateDto = exports.CreateTourDateDto = void 0;
const class_validator_1 = require("class-validator");
const mapped_types_1 = require("@nestjs/mapped-types");
const tour_date_status_enum_1 = require("../../../common/enums/tour-date-status.enum");
class CreateTourDateDto {
    tour;
    startDate;
    endDate;
    totalSeats;
    priceOverride;
    departureNote;
}
exports.CreateTourDateDto = CreateTourDateDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourDateDto.prototype, "tour", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourDateDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTourDateDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateTourDateDto.prototype, "totalSeats", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateTourDateDto.prototype, "priceOverride", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTourDateDto.prototype, "departureNote", void 0);
class UpdateTourDateDto extends (0, mapped_types_1.PartialType)(CreateTourDateDto) {
    status;
}
exports.UpdateTourDateDto = UpdateTourDateDto;
__decorate([
    (0, class_validator_1.IsEnum)(tour_date_status_enum_1.TourDateStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateTourDateDto.prototype, "status", void 0);
//# sourceMappingURL=create-tour-date.dto.js.map