import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Tour } from '../schemas/tour.schema';
import { Booking } from '../schemas/booking.schema';
export type ReviewDocument = Review & Document;
export declare class Review {
    user: User;
    tour: Tour;
    booking: Booking;
    rating: number;
    comment: string;
    status: string;
    adminNote: string;
}
export declare const ReviewSchema: MongooseSchema<Review, import("mongoose").Model<Review, any, any, any, (Document<unknown, any, Review, any, import("mongoose").DefaultSchemaOptions> & Review & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Review, any, import("mongoose").DefaultSchemaOptions> & Review & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Review>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, Review, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user?: import("mongoose").SchemaDefinitionProperty<User, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tour?: import("mongoose").SchemaDefinitionProperty<Tour, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    booking?: import("mongoose").SchemaDefinitionProperty<Booking, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rating?: import("mongoose").SchemaDefinitionProperty<number, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    comment?: import("mongoose").SchemaDefinitionProperty<string, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    adminNote?: import("mongoose").SchemaDefinitionProperty<string, Review, Document<unknown, {}, Review, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Review>;
