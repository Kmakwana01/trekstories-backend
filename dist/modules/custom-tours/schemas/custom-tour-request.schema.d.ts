import { Document } from 'mongoose';
export declare enum CustomTourStatus {
    NEW = "NEW",
    CONTACTED = "CONTACTED",
    CLOSED = "CLOSED"
}
export type CustomTourRequestDocument = CustomTourRequest & Document;
export declare class CustomTourRequest {
    name: string;
    email: string;
    phone: string;
    destination: string;
    travelDates: string;
    groupSize: number;
    budget: string;
    tourType: string;
    message: string;
    status: CustomTourStatus;
    adminNotes: string;
}
export declare const CustomTourRequestSchema: import("mongoose").Schema<CustomTourRequest, import("mongoose").Model<CustomTourRequest, any, any, any, (Document<unknown, any, CustomTourRequest, any, import("mongoose").DefaultSchemaOptions> & CustomTourRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, CustomTourRequest, any, import("mongoose").DefaultSchemaOptions> & CustomTourRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, CustomTourRequest>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    destination?: import("mongoose").SchemaDefinitionProperty<string, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    travelDates?: import("mongoose").SchemaDefinitionProperty<string, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    groupSize?: import("mongoose").SchemaDefinitionProperty<number, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    budget?: import("mongoose").SchemaDefinitionProperty<string, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tourType?: import("mongoose").SchemaDefinitionProperty<string, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<CustomTourStatus, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    adminNotes?: import("mongoose").SchemaDefinitionProperty<string, CustomTourRequest, Document<unknown, {}, CustomTourRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTourRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CustomTourRequest>;
