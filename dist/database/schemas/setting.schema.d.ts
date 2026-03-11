import { Document } from 'mongoose';
export type SettingDocument = Setting & Document;
export declare class BusinessDetails {
    upiId?: string;
    gstRate?: number;
    phoneNumber?: string;
    officeAddress?: string;
    supportEmail?: string;
    newsletterEmail?: string;
}
export declare class SocialMedia {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
}
export declare class PaymentDetails {
    upiQrImageUrl?: string;
}
export declare class OtherSettings {
    footerDescription?: string;
    seoMetaTitle?: string;
    seoMetaDescription?: string;
    logoUrl?: string;
    whatsappNumberForNotifications?: string;
    whatsappEnabled?: boolean;
    whatsappPhoneNumberId?: string;
    whatsappAccessToken?: string;
}
export declare class PolicyContent {
    privacyPolicy?: string;
    termsAndConditions?: string;
    refundPolicy?: string;
    cancellationPolicy?: string;
    bookingInstructions?: string;
}
export declare class HeroContent {
    heroTitle?: string;
    heroSubtitle?: string;
    heroCta?: string;
    heroCtaUrl?: string;
    heroBannerImage?: string;
    heroHighlights?: string[];
}
export declare class WhyChooseUsItem {
    title?: string;
    description?: string;
    icon?: string;
}
export declare class AboutContent {
    heroTitle?: string;
    heroSubtitle?: string;
    missionStatement?: string;
    whyChooseUs?: WhyChooseUsItem[];
}
export declare class JobListing {
    title?: string;
    location?: string;
    type?: string;
    description?: string;
    applyUrl?: string;
}
export declare class CareerContent {
    heroTitle?: string;
    heroSubtitle?: string;
    cultureDescription?: string;
    benefits?: string[];
    jobs?: JobListing[];
}
export declare class FaqItem {
    question?: string;
    answer?: string;
}
export declare class Setting {
    isGlobal: boolean;
    businessDetails: BusinessDetails;
    socialMedia: SocialMedia;
    paymentDetails: PaymentDetails;
    otherSettings: OtherSettings;
    policies: PolicyContent;
    heroContent: HeroContent;
    aboutContent: AboutContent;
    careerContent: CareerContent;
    faqs: FaqItem[];
    adminIpWhitelist?: string[];
}
export declare const SettingSchema: import("mongoose").Schema<Setting, import("mongoose").Model<Setting, any, any, any, (Document<unknown, any, Setting, any, import("mongoose").DefaultSchemaOptions> & Setting & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Setting, any, import("mongoose").DefaultSchemaOptions> & Setting & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Setting>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Setting, Document<unknown, {}, Setting, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    isGlobal?: import("mongoose").SchemaDefinitionProperty<boolean, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    businessDetails?: import("mongoose").SchemaDefinitionProperty<BusinessDetails, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    socialMedia?: import("mongoose").SchemaDefinitionProperty<SocialMedia, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentDetails?: import("mongoose").SchemaDefinitionProperty<PaymentDetails, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    otherSettings?: import("mongoose").SchemaDefinitionProperty<OtherSettings, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    policies?: import("mongoose").SchemaDefinitionProperty<PolicyContent, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    heroContent?: import("mongoose").SchemaDefinitionProperty<HeroContent, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aboutContent?: import("mongoose").SchemaDefinitionProperty<AboutContent, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    careerContent?: import("mongoose").SchemaDefinitionProperty<CareerContent, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    faqs?: import("mongoose").SchemaDefinitionProperty<FaqItem[], Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    adminIpWhitelist?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Setting, Document<unknown, {}, Setting, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Setting & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Setting>;
