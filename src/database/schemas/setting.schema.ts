import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ _id: false })
export class BusinessDetails {
    @Prop()
    upiId?: string;

    @Prop({ default: 5 })
    gstRate?: number;

    @Prop()
    phoneNumber?: string;

    @Prop()
    alternatePhone?: string;

    @Prop()
    businessEmail?: string;

    @Prop()
    officeAddress?: string;

    @Prop()
    supportEmail?: string;
}

@Schema({ _id: false })
export class SocialMedia {
    @Prop()
    facebook?: string;

    @Prop()
    instagram?: string;

    @Prop()
    twitter?: string;

    @Prop()
    youtube?: string;

    @Prop()
    linkedin?: string;

    @Prop()
    whatsapp?: string;
}

@Schema({ _id: false })
export class PaymentDetails {
    @Prop()
    upiQrImageUrl?: string;

    @Prop()
    bankAccountDetails?: string;
}

@Schema({ _id: false })
export class OtherSettings {
    @Prop()
    footerDescription?: string;

    @Prop()
    newsletterEmail?: string;

    @Prop()
    seoMetaTitle?: string;

    @Prop()
    seoMetaDescription?: string;

    @Prop()
    logoUrl?: string;
}

@Schema({ _id: false })
export class PolicyContent {
    @Prop()
    privacyPolicy?: string;

    @Prop()
    termsAndConditions?: string;

    @Prop()
    refundPolicy?: string;

    @Prop()
    cancellationPolicy?: string;

    @Prop()
    bookingInstructions?: string;
}

@Schema({ _id: false })
export class HeroContent {
    @Prop()
    heroTitle?: string;

    @Prop()
    heroSubtitle?: string;

    @Prop()
    heroCta?: string;

    @Prop()
    heroCtaUrl?: string;

    @Prop()
    heroBannerImage?: string;

    @Prop({ type: [String], default: [] })
    heroHighlights?: string[];
}

@Schema({ _id: false })
export class WhyChooseUsItem {
    @Prop()
    title?: string;

    @Prop()
    description?: string;

    @Prop()
    icon?: string;
}

@Schema({ _id: false })
export class AboutContent {
    @Prop()
    heroTitle?: string;

    @Prop()
    heroSubtitle?: string;

    @Prop()
    missionStatement?: string;

    @Prop({ type: [WhyChooseUsItem], default: [] })
    whyChooseUs?: WhyChooseUsItem[];
}

@Schema({ _id: false })
export class JobListing {
    @Prop()
    title?: string;

    @Prop()
    location?: string;

    @Prop()
    type?: string;

    @Prop()
    description?: string;

    @Prop()
    applyUrl?: string;
}

@Schema({ _id: false })
export class CareerContent {
    @Prop()
    heroTitle?: string;

    @Prop()
    heroSubtitle?: string;

    @Prop()
    cultureDescription?: string;

    @Prop({ type: [String], default: [] })
    benefits?: string[];

    @Prop({ type: [JobListing], default: [] })
    jobs?: JobListing[];
}

@Schema({ _id: false })
export class FaqItem {
    @Prop()
    question?: string;

    @Prop()
    answer?: string;
}

@Schema({ timestamps: true })
export class Setting {
    @Prop({ default: true, unique: true, index: true })
    isGlobal: boolean;

    @Prop({ type: BusinessDetails, default: () => ({}) })
    businessDetails: BusinessDetails;

    @Prop({ type: SocialMedia, default: () => ({}) })
    socialMedia: SocialMedia;

    @Prop({ type: PaymentDetails, default: () => ({}) })
    paymentDetails: PaymentDetails;

    @Prop({ type: OtherSettings, default: () => ({}) })
    otherSettings: OtherSettings;

    @Prop({ type: PolicyContent, default: () => ({}) })
    policies: PolicyContent;

    @Prop({ type: HeroContent, default: () => ({}) })
    heroContent: HeroContent;

    @Prop({ type: AboutContent, default: () => ({}) })
    aboutContent: AboutContent;

    @Prop({ type: CareerContent, default: () => ({}) })
    careerContent: CareerContent;

    @Prop({ type: [FaqItem], default: [] })
    faqs: FaqItem[];
}

export const SettingSchema = SchemaFactory.createForClass(Setting);