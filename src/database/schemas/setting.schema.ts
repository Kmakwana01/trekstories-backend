import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ _id: false })
export class BusinessDetails {
    @Prop()
    upiId?: string;

    @Prop()
    gstNumber?: string;

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
}

export const SettingSchema = SchemaFactory.createForClass(Setting);