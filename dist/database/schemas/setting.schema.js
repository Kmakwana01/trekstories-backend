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
exports.SettingSchema = exports.Setting = exports.FaqItem = exports.CareerContent = exports.JobListing = exports.AboutContent = exports.WhyChooseUsItem = exports.HeroContent = exports.PolicyContent = exports.OtherSettings = exports.PaymentDetails = exports.SocialMedia = exports.BusinessDetails = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let BusinessDetails = class BusinessDetails {
    upiId;
    gstRate;
    phoneNumber;
    officeAddress;
    supportEmail;
};
exports.BusinessDetails = BusinessDetails;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessDetails.prototype, "upiId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 5 }),
    __metadata("design:type", Number)
], BusinessDetails.prototype, "gstRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessDetails.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessDetails.prototype, "officeAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessDetails.prototype, "supportEmail", void 0);
exports.BusinessDetails = BusinessDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], BusinessDetails);
let SocialMedia = class SocialMedia {
    facebook;
    instagram;
    linkedin;
    whatsapp;
};
exports.SocialMedia = SocialMedia;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SocialMedia.prototype, "facebook", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SocialMedia.prototype, "instagram", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SocialMedia.prototype, "linkedin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SocialMedia.prototype, "whatsapp", void 0);
exports.SocialMedia = SocialMedia = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], SocialMedia);
let PaymentDetails = class PaymentDetails {
    upiQrImageUrl;
};
exports.PaymentDetails = PaymentDetails;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentDetails.prototype, "upiQrImageUrl", void 0);
exports.PaymentDetails = PaymentDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PaymentDetails);
let OtherSettings = class OtherSettings {
    footerDescription;
    seoMetaTitle;
    seoMetaDescription;
    logoUrl;
    whatsappNumberForNotifications;
    whatsappEnabled;
    whatsappPhoneNumberId;
    whatsappAccessToken;
};
exports.OtherSettings = OtherSettings;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OtherSettings.prototype, "footerDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OtherSettings.prototype, "seoMetaTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OtherSettings.prototype, "seoMetaDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OtherSettings.prototype, "logoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OtherSettings.prototype, "whatsappNumberForNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], OtherSettings.prototype, "whatsappEnabled", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OtherSettings.prototype, "whatsappPhoneNumberId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OtherSettings.prototype, "whatsappAccessToken", void 0);
exports.OtherSettings = OtherSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OtherSettings);
let PolicyContent = class PolicyContent {
    privacyPolicy;
    termsAndConditions;
    refundPolicy;
    cancellationPolicy;
    bookingInstructions;
};
exports.PolicyContent = PolicyContent;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PolicyContent.prototype, "privacyPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PolicyContent.prototype, "termsAndConditions", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PolicyContent.prototype, "refundPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PolicyContent.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PolicyContent.prototype, "bookingInstructions", void 0);
exports.PolicyContent = PolicyContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PolicyContent);
let HeroContent = class HeroContent {
    heroTitle;
    heroSubtitle;
    heroCta;
    heroCtaUrl;
    heroBannerImage;
    heroHighlights;
};
exports.HeroContent = HeroContent;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroContent.prototype, "heroTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroContent.prototype, "heroSubtitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroContent.prototype, "heroCta", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroContent.prototype, "heroCtaUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], HeroContent.prototype, "heroBannerImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], HeroContent.prototype, "heroHighlights", void 0);
exports.HeroContent = HeroContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], HeroContent);
let WhyChooseUsItem = class WhyChooseUsItem {
    title;
    description;
    icon;
};
exports.WhyChooseUsItem = WhyChooseUsItem;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WhyChooseUsItem.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WhyChooseUsItem.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WhyChooseUsItem.prototype, "icon", void 0);
exports.WhyChooseUsItem = WhyChooseUsItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], WhyChooseUsItem);
let AboutContent = class AboutContent {
    heroTitle;
    heroSubtitle;
    missionStatement;
    whyChooseUs;
};
exports.AboutContent = AboutContent;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "heroTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "heroSubtitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AboutContent.prototype, "missionStatement", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [WhyChooseUsItem], default: [] }),
    __metadata("design:type", Array)
], AboutContent.prototype, "whyChooseUs", void 0);
exports.AboutContent = AboutContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], AboutContent);
let JobListing = class JobListing {
    title;
    location;
    type;
    description;
    applyUrl;
};
exports.JobListing = JobListing;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], JobListing.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], JobListing.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], JobListing.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], JobListing.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], JobListing.prototype, "applyUrl", void 0);
exports.JobListing = JobListing = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], JobListing);
let CareerContent = class CareerContent {
    heroTitle;
    heroSubtitle;
    cultureDescription;
    benefits;
    jobs;
};
exports.CareerContent = CareerContent;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CareerContent.prototype, "heroTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CareerContent.prototype, "heroSubtitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CareerContent.prototype, "cultureDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], CareerContent.prototype, "benefits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [JobListing], default: [] }),
    __metadata("design:type", Array)
], CareerContent.prototype, "jobs", void 0);
exports.CareerContent = CareerContent = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CareerContent);
let FaqItem = class FaqItem {
    question;
    answer;
};
exports.FaqItem = FaqItem;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FaqItem.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], FaqItem.prototype, "answer", void 0);
exports.FaqItem = FaqItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FaqItem);
let Setting = class Setting {
    isGlobal;
    businessDetails;
    socialMedia;
    paymentDetails;
    otherSettings;
    policies;
    heroContent;
    heroSliders;
    aboutContent;
    careerContent;
    faqs;
    adminIpWhitelist;
};
exports.Setting = Setting;
__decorate([
    (0, mongoose_1.Prop)({ default: true, unique: true, index: true }),
    __metadata("design:type", Boolean)
], Setting.prototype, "isGlobal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BusinessDetails, default: () => ({}) }),
    __metadata("design:type", BusinessDetails)
], Setting.prototype, "businessDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SocialMedia, default: () => ({}) }),
    __metadata("design:type", SocialMedia)
], Setting.prototype, "socialMedia", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PaymentDetails, default: () => ({}) }),
    __metadata("design:type", PaymentDetails)
], Setting.prototype, "paymentDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: OtherSettings, default: () => ({}) }),
    __metadata("design:type", OtherSettings)
], Setting.prototype, "otherSettings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PolicyContent, default: () => ({}) }),
    __metadata("design:type", PolicyContent)
], Setting.prototype, "policies", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: HeroContent, default: () => ({}) }),
    __metadata("design:type", HeroContent)
], Setting.prototype, "heroContent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [HeroContent], default: [] }),
    __metadata("design:type", Array)
], Setting.prototype, "heroSliders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: AboutContent, default: () => ({}) }),
    __metadata("design:type", AboutContent)
], Setting.prototype, "aboutContent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: CareerContent, default: () => ({}) }),
    __metadata("design:type", CareerContent)
], Setting.prototype, "careerContent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FaqItem], default: [] }),
    __metadata("design:type", Array)
], Setting.prototype, "faqs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Setting.prototype, "adminIpWhitelist", void 0);
exports.Setting = Setting = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Setting);
exports.SettingSchema = mongoose_1.SchemaFactory.createForClass(Setting);
//# sourceMappingURL=setting.schema.js.map