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
exports.UpdateSettingDto = exports.OtherSettingsDto = exports.PaymentDetailsDto = exports.SocialMediaDto = exports.BusinessDetailsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BusinessDetailsDto {
    upiId;
    gstRate;
    phoneNumber;
    alternatePhone;
    businessEmail;
    officeAddress;
    supportEmail;
}
exports.BusinessDetailsDto = BusinessDetailsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "upiId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'GST rate as a percentage (e.g. 5 for 5%). Range: 0–28.' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(28),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BusinessDetailsDto.prototype, "gstRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "alternatePhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "businessEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "officeAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "supportEmail", void 0);
class SocialMediaDto {
    facebook;
    instagram;
    twitter;
    youtube;
    linkedin;
    whatsapp;
}
exports.SocialMediaDto = SocialMediaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "facebook", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "instagram", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "twitter", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "youtube", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "linkedin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "whatsapp", void 0);
class PaymentDetailsDto {
    upiQrImageUrl;
    bankAccountDetails;
}
exports.PaymentDetailsDto = PaymentDetailsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaymentDetailsDto.prototype, "upiQrImageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaymentDetailsDto.prototype, "bankAccountDetails", void 0);
class OtherSettingsDto {
    footerDescription;
    newsletterEmail;
    seoMetaTitle;
    seoMetaDescription;
    logoUrl;
}
exports.OtherSettingsDto = OtherSettingsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OtherSettingsDto.prototype, "footerDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OtherSettingsDto.prototype, "newsletterEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OtherSettingsDto.prototype, "seoMetaTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OtherSettingsDto.prototype, "seoMetaDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OtherSettingsDto.prototype, "logoUrl", void 0);
class UpdateSettingDto {
    businessDetails;
    socialMedia;
    paymentDetails;
    otherSettings;
}
exports.UpdateSettingDto = UpdateSettingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: BusinessDetailsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessDetailsDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", BusinessDetailsDto)
], UpdateSettingDto.prototype, "businessDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SocialMediaDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SocialMediaDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", SocialMediaDto)
], UpdateSettingDto.prototype, "socialMedia", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: PaymentDetailsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentDetailsDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PaymentDetailsDto)
], UpdateSettingDto.prototype, "paymentDetails", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: OtherSettingsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => OtherSettingsDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", OtherSettingsDto)
], UpdateSettingDto.prototype, "otherSettings", void 0);
//# sourceMappingURL=update-setting.dto.js.map