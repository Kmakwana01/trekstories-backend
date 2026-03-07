import { Document } from 'mongoose';
export declare class SocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
}
export declare class TeamMember {
    name: string;
    designation: string;
    bio: string;
    image: string;
    socialLinks: SocialLinks;
    order: number;
    isActive: boolean;
}
export type TeamMemberDocument = TeamMember & Document;
export declare const TeamMemberSchema: import("mongoose").Schema<TeamMember, import("mongoose").Model<TeamMember, any, any, any, (Document<unknown, any, TeamMember, any, import("mongoose").DefaultSchemaOptions> & TeamMember & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, TeamMember, any, import("mongoose").DefaultSchemaOptions> & TeamMember & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, TeamMember>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TeamMember, Document<unknown, {}, TeamMember, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TeamMember & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, TeamMember, Document<unknown, {}, TeamMember, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TeamMember & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    designation?: import("mongoose").SchemaDefinitionProperty<string, TeamMember, Document<unknown, {}, TeamMember, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TeamMember & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bio?: import("mongoose").SchemaDefinitionProperty<string, TeamMember, Document<unknown, {}, TeamMember, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TeamMember & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    image?: import("mongoose").SchemaDefinitionProperty<string, TeamMember, Document<unknown, {}, TeamMember, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TeamMember & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    socialLinks?: import("mongoose").SchemaDefinitionProperty<SocialLinks, TeamMember, Document<unknown, {}, TeamMember, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TeamMember & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    order?: import("mongoose").SchemaDefinitionProperty<number, TeamMember, Document<unknown, {}, TeamMember, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TeamMember & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, TeamMember, Document<unknown, {}, TeamMember, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TeamMember & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, TeamMember>;
