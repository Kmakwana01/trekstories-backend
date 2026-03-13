import { Document, Schema as MongooseSchema } from 'mongoose';
export type TourDateDocument = TourDate & Document;
export declare class TourDate {
    tour: MongooseSchema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalSeats: number;
    bookedSeats: number;
    priceOverride: number;
    departureNote: string;
    status: string;
}
export declare const TourDateSchema: MongooseSchema<TourDate, import("mongoose").Model<TourDate, any, any, any, (Document<unknown, any, TourDate, any, import("mongoose").DefaultSchemaOptions> & TourDate & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, TourDate, any, import("mongoose").DefaultSchemaOptions> & TourDate & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, TourDate>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TourDate, Document<unknown, {}, TourDate, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TourDate & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    tour?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, TourDate, Document<unknown, {}, TourDate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TourDate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, TourDate, Document<unknown, {}, TourDate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TourDate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, TourDate, Document<unknown, {}, TourDate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TourDate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalSeats?: import("mongoose").SchemaDefinitionProperty<number, TourDate, Document<unknown, {}, TourDate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TourDate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bookedSeats?: import("mongoose").SchemaDefinitionProperty<number, TourDate, Document<unknown, {}, TourDate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TourDate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    priceOverride?: import("mongoose").SchemaDefinitionProperty<number, TourDate, Document<unknown, {}, TourDate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TourDate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    departureNote?: import("mongoose").SchemaDefinitionProperty<string, TourDate, Document<unknown, {}, TourDate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TourDate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, TourDate, Document<unknown, {}, TourDate, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TourDate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, TourDate>;
