import { Document, Schema as MongooseSchema } from 'mongoose';
export type CouponDocument = Coupon & Document;
export declare class Coupon {
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    maxDiscountAmount: number;
    expiryDate: Date;
    maxUsage: number;
    maxUsagePerUser: number;
    usedCount: number;
    minOrderAmount: number;
    applicableTours: MongooseSchema.Types.ObjectId[];
    isActive: boolean;
}
export declare const CouponSchema: MongooseSchema<Coupon, import("mongoose").Model<Coupon, any, any, any, (Document<unknown, any, Coupon, any, import("mongoose").DefaultSchemaOptions> & Coupon & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Coupon, any, import("mongoose").DefaultSchemaOptions> & Coupon & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Coupon>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Coupon, Document<unknown, {}, Coupon, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    code?: import("mongoose").SchemaDefinitionProperty<string, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    discountType?: import("mongoose").SchemaDefinitionProperty<string, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    discountValue?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxDiscountAmount?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expiryDate?: import("mongoose").SchemaDefinitionProperty<Date, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxUsage?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxUsagePerUser?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    usedCount?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minOrderAmount?: import("mongoose").SchemaDefinitionProperty<number, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    applicableTours?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId[], Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Coupon, Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Coupon>;
