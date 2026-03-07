import { Document, Schema as MongooseSchema } from 'mongoose';
export type NotificationDocument = Notification & Document;
export declare class Notification {
    user: MongooseSchema.Types.ObjectId;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    readAt: Date;
    metadata: any;
}
export declare const NotificationSchema: MongooseSchema<Notification, import("mongoose").Model<Notification, any, any, any, (Document<unknown, any, Notification, any, import("mongoose").DefaultSchemaOptions> & Notification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Notification, any, import("mongoose").DefaultSchemaOptions> & Notification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Notification>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, Notification, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isRead?: import("mongoose").SchemaDefinitionProperty<boolean, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    readAt?: import("mongoose").SchemaDefinitionProperty<Date, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<any, Notification, Document<unknown, {}, Notification, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Notification>;
