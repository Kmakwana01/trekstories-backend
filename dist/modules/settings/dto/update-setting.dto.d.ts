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
export declare class PolicyContentDto {
    privacyPolicy?: string;
    termsAndConditions?: string;
    refundPolicy?: string;
    cancellationPolicy?: string;
    bookingInstructions?: string;
}
export declare class HeroContentDto {
    heroTitle?: string;
    heroSubtitle?: string;
    heroCta?: string;
    heroCtaUrl?: string;
    heroBannerImage?: string;
    heroHighlights?: string[];
}
export declare class WhyChooseUsItemDto {
    title?: string;
    description?: string;
    icon?: string;
}
export declare class AboutContentDto {
    heroTitle?: string;
    heroSubtitle?: string;
    missionStatement?: string;
    whyChooseUs?: WhyChooseUsItemDto[];
}
export declare class JobListingDto {
    title?: string;
    location?: string;
    type?: string;
    description?: string;
    applyUrl?: string;
}
export declare class CareerContentDto {
    heroTitle?: string;
    heroSubtitle?: string;
    cultureDescription?: string;
    benefits?: string[];
    jobs?: JobListingDto[];
}
export declare class FaqItemDto {
    question?: string;
    answer?: string;
}
export declare class UpdateSettingDto {
    businessDetails?: BusinessDetailsDto;
    socialMedia?: SocialMediaDto;
    paymentDetails?: PaymentDetailsDto;
    otherSettings?: OtherSettingsDto;
    policies?: PolicyContentDto;
    heroContent?: HeroContentDto;
    aboutContent?: AboutContentDto;
    careerContent?: CareerContentDto;
    faqs?: FaqItemDto[];
}
