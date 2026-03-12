import { Document } from 'mongoose';
export type CustomTourDocument = CustomTour & Document;
export declare enum CustomTourStatus {
    PENDING = "PENDING",
    CONTACTED = "CONTACTED",
    RESOLVED = "RESOLVED",
    CLOSED = "CLOSED"
}
export declare class CustomTour {
    name: string;
    email: string;
    phone: string;
    destination: string;
    duration: number;
    travelDate: Date;
    groupSize: number;
    message: string;
    status: CustomTourStatus;
    adminNotes: string;
}
export declare const CustomTourSchema: import("mongoose").Schema<CustomTour, import("mongoose").Model<CustomTour, any, any, any, (Document<unknown, any, CustomTour, any, import("mongoose").DefaultSchemaOptions> & CustomTour & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, CustomTour, any, import("mongoose").DefaultSchemaOptions> & CustomTour & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, CustomTour>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CustomTour, Document<unknown, {}, CustomTour, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    destination?: import("mongoose").SchemaDefinitionProperty<string, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    duration?: import("mongoose").SchemaDefinitionProperty<number, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    travelDate?: import("mongoose").SchemaDefinitionProperty<Date, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    groupSize?: import("mongoose").SchemaDefinitionProperty<number, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    message?: import("mongoose").SchemaDefinitionProperty<string, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<CustomTourStatus, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    adminNotes?: import("mongoose").SchemaDefinitionProperty<string, CustomTour, Document<unknown, {}, CustomTour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CustomTour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CustomTour>;
