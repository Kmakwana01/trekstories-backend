export declare class BusinessDetailsDto {
    upiId?: string;
    gstRate?: number;
    phoneNumber?: string;
    alternatePhone?: string;
    businessEmail?: string;
    officeAddress?: string;
    supportEmail?: string;
}
export declare class SocialMediaDto {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    whatsapp?: string;
}
export declare class PaymentDetailsDto {
    upiQrImageUrl?: string;
    bankAccountDetails?: string;
}
export declare class OtherSettingsDto {
    footerDescription?: string;
    newsletterEmail?: string;
    seoMetaTitle?: string;
    seoMetaDescription?: string;
    logoUrl?: string;
}
export declare class UpdateSettingDto {
    businessDetails?: BusinessDetailsDto;
    socialMedia?: SocialMediaDto;
    paymentDetails?: PaymentDetailsDto;
    otherSettings?: OtherSettingsDto;
}
