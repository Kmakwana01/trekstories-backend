import { Document } from 'mongoose';
export type SettingDocument = Setting & Document;
export declare class BusinessDetails {
    upiId?: string;
    gstRate?: number;
    phoneNumber?: string;
    alternatePhone?: string;
    businessEmail?: string;
    officeAddress?: string;
    supportEmail?: string;
}
export declare class SocialMedia {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    whatsapp?: string;
}
export declare class PaymentDetails {
    upiQrImageUrl?: string;
    bankAccountDetails?: string;
}
export declare class OtherSettings {
    footerDescription?: string;
    newsletterEmail?: string;
    seoMetaTitle?: string;
    seoMetaDescription?: string;
    logoUrl?: string;
}
export declare class Setting {
    isGlobal: boolean;
    businessDetails: BusinessDetails;
    socialMedia: SocialMedia;
    paymentDetails: PaymentDetails;
    otherSettings: OtherSettings;
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
}, Setting>;
