import { Document, Schema as MongooseSchema } from 'mongoose';
export type AdminLogDocument = AdminLog & Document;
export declare class AdminLog {
    admin: MongooseSchema.Types.ObjectId;
    action: string;
    module: string;
    targetId: string;
    details: any;
    ipAddress: string;
    userAgent: string;
}
export declare const AdminLogSchema: MongooseSchema<AdminLog, import("mongoose").Model<AdminLog, any, any, any, (Document<unknown, any, AdminLog, any, import("mongoose").DefaultSchemaOptions> & AdminLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, AdminLog, any, import("mongoose").DefaultSchemaOptions> & AdminLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, AdminLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AdminLog, Document<unknown, {}, AdminLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AdminLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    admin?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, AdminLog, Document<unknown, {}, AdminLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    action?: import("mongoose").SchemaDefinitionProperty<string, AdminLog, Document<unknown, {}, AdminLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<string, AdminLog, Document<unknown, {}, AdminLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetId?: import("mongoose").SchemaDefinitionProperty<string, AdminLog, Document<unknown, {}, AdminLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    details?: import("mongoose").SchemaDefinitionProperty<any, AdminLog, Document<unknown, {}, AdminLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ipAddress?: import("mongoose").SchemaDefinitionProperty<string, AdminLog, Document<unknown, {}, AdminLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userAgent?: import("mongoose").SchemaDefinitionProperty<string, AdminLog, Document<unknown, {}, AdminLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AdminLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, AdminLog>;
