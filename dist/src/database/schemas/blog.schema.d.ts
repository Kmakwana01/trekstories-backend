import { Document, Schema as MongooseSchema } from 'mongoose';
export declare class Blog {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    author: MongooseSchema.Types.ObjectId;
    featuredImage: string;
    tags: string[];
    isPublished: boolean;
    publishedAt: Date;
    viewCount: number;
}
export type BlogDocument = Blog & Document;
export declare const BlogSchema: MongooseSchema<Blog, import("mongoose").Model<Blog, any, any, any, (Document<unknown, any, Blog, any, import("mongoose").DefaultSchemaOptions> & Blog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Blog, any, import("mongoose").DefaultSchemaOptions> & Blog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Blog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Blog, Document<unknown, {}, Blog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    content?: import("mongoose").SchemaDefinitionProperty<string, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    excerpt?: import("mongoose").SchemaDefinitionProperty<string, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    author?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    featuredImage?: import("mongoose").SchemaDefinitionProperty<string, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tags?: import("mongoose").SchemaDefinitionProperty<string[], Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    publishedAt?: import("mongoose").SchemaDefinitionProperty<Date, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    viewCount?: import("mongoose").SchemaDefinitionProperty<number, Blog, Document<unknown, {}, Blog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Blog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Blog>;
