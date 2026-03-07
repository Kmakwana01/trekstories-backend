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
exports.SettingSchema = exports.Setting = exports.OtherSettings = exports.PaymentDetails = exports.SocialMedia = exports.BusinessDetails = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let BusinessDetails = class BusinessDetails {
    upiId;
    gstRate;
    phoneNumber;
    alternatePhone;
    businessEmail;
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
], BusinessDetails.prototype, "alternatePhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessDetails.prototype, "businessEmail", void 0);
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
    twitter;
    youtube;
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
], SocialMedia.prototype, "twitter", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SocialMedia.prototype, "youtube", void 0);
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
    bankAccountDetails;
};
exports.PaymentDetails = PaymentDetails;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentDetails.prototype, "upiQrImageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentDetails.prototype, "bankAccountDetails", void 0);
exports.PaymentDetails = PaymentDetails = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PaymentDetails);
let OtherSettings = class OtherSettings {
    footerDescription;
    newsletterEmail;
    seoMetaTitle;
    seoMetaDescription;
    logoUrl;
};
exports.OtherSettings = OtherSettings;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OtherSettings.prototype, "footerDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OtherSettings.prototype, "newsletterEmail", void 0);
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
exports.OtherSettings = OtherSettings = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OtherSettings);
let Setting = class Setting {
    isGlobal;
    businessDetails;
    socialMedia;
    paymentDetails;
    otherSettings;
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
exports.Setting = Setting = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Setting);
exports.SettingSchema = mongoose_1.SchemaFactory.createForClass(Setting);
//# sourceMappingURL=setting.schema.js.map