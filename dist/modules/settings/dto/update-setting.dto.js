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
exports.UpdateSettingDto = exports.FaqItemDto = exports.CareerContentDto = exports.JobListingDto = exports.AboutContentDto = exports.WhyChooseUsItemDto = exports.HeroContentDto = exports.PolicyContentDto = exports.OtherSettingsDto = exports.PaymentDetailsDto = exports.SocialMediaDto = exports.BusinessDetailsDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BusinessDetailsDto {
    upiId;
    gstRate;
    phoneNumber;
    officeAddress;
    supportEmail;
    newsletterEmail;
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
], BusinessDetailsDto.prototype, "officeAddress", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "supportEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'The email address where newsletter subscription alerts are sent' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "newsletterEmail", void 0);
class SocialMediaDto {
    facebook;
    instagram;
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
], SocialMediaDto.prototype, "linkedin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SocialMediaDto.prototype, "whatsapp", void 0);
class PaymentDetailsDto {
    upiQrImageUrl;
}
exports.PaymentDetailsDto = PaymentDetailsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PaymentDetailsDto.prototype, "upiQrImageUrl", void 0);
class OtherSettingsDto {
    footerDescription;
    seoMetaTitle;
    seoMetaDescription;
    logoUrl;
    whatsappNumberForNotifications;
    whatsappEnabled;
    whatsappPhoneNumberId;
    whatsappAccessToken;
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OtherSettingsDto.prototype, "whatsappNumberForNotifications", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], OtherSettingsDto.prototype, "whatsappEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OtherSettingsDto.prototype, "whatsappPhoneNumberId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OtherSettingsDto.prototype, "whatsappAccessToken", void 0);
class PolicyContentDto {
    privacyPolicy;
    termsAndConditions;
    refundPolicy;
    cancellationPolicy;
    bookingInstructions;
}
exports.PolicyContentDto = PolicyContentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PolicyContentDto.prototype, "privacyPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PolicyContentDto.prototype, "termsAndConditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PolicyContentDto.prototype, "refundPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PolicyContentDto.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PolicyContentDto.prototype, "bookingInstructions", void 0);
class HeroContentDto {
    heroTitle;
    heroSubtitle;
    heroCta;
    heroCtaUrl;
    heroBannerImage;
    heroHighlights;
}
exports.HeroContentDto = HeroContentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HeroContentDto.prototype, "heroTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HeroContentDto.prototype, "heroSubtitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HeroContentDto.prototype, "heroCta", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HeroContentDto.prototype, "heroCtaUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], HeroContentDto.prototype, "heroBannerImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], HeroContentDto.prototype, "heroHighlights", void 0);
class WhyChooseUsItemDto {
    title;
    description;
    icon;
}
exports.WhyChooseUsItemDto = WhyChooseUsItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WhyChooseUsItemDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WhyChooseUsItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WhyChooseUsItemDto.prototype, "icon", void 0);
class AboutContentDto {
    heroTitle;
    heroSubtitle;
    missionStatement;
    whyChooseUs;
}
exports.AboutContentDto = AboutContentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "heroTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "heroSubtitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AboutContentDto.prototype, "missionStatement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [WhyChooseUsItemDto] }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WhyChooseUsItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AboutContentDto.prototype, "whyChooseUs", void 0);
class JobListingDto {
    title;
    location;
    type;
    description;
    applyUrl;
}
exports.JobListingDto = JobListingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobListingDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobListingDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobListingDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobListingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JobListingDto.prototype, "applyUrl", void 0);
class CareerContentDto {
    heroTitle;
    heroSubtitle;
    cultureDescription;
    benefits;
    jobs;
}
exports.CareerContentDto = CareerContentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CareerContentDto.prototype, "heroTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CareerContentDto.prototype, "heroSubtitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CareerContentDto.prototype, "cultureDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CareerContentDto.prototype, "benefits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [JobListingDto] }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => JobListingDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CareerContentDto.prototype, "jobs", void 0);
class FaqItemDto {
    question;
    answer;
}
exports.FaqItemDto = FaqItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FaqItemDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FaqItemDto.prototype, "answer", void 0);
class UpdateSettingDto {
    businessDetails;
    socialMedia;
    paymentDetails;
    otherSettings;
    policies;
    heroContent;
    aboutContent;
    careerContent;
    faqs;
    adminIpWhitelist;
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: PolicyContentDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PolicyContentDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", PolicyContentDto)
], UpdateSettingDto.prototype, "policies", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: HeroContentDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => HeroContentDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", HeroContentDto)
], UpdateSettingDto.prototype, "heroContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: AboutContentDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AboutContentDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", AboutContentDto)
], UpdateSettingDto.prototype, "aboutContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CareerContentDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CareerContentDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", CareerContentDto)
], UpdateSettingDto.prototype, "careerContent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [FaqItemDto] }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FaqItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateSettingDto.prototype, "faqs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateSettingDto.prototype, "adminIpWhitelist", void 0);
//# sourceMappingURL=update-setting.dto.js.map