import { Document } from 'mongoose';
export type TourDocument = Tour & Document;
declare class ItineraryPoint {
    text: string;
    description: string;
}
declare class ItineraryDay {
    dayNumber: number;
    title: string;
    points: ItineraryPoint[];
}
export declare class PickupPoint {
    fromCity: string;
    toCity: string;
    type: string;
    departureTimeAndPlace: string;
    totalDays: number;
    totalNights: number;
    priceAdjustment: number;
}
export declare const PickupPointSchema: import("mongoose").Schema<PickupPoint, import("mongoose").Model<PickupPoint, any, any, any, (Document<unknown, any, PickupPoint, any, import("mongoose").DefaultSchemaOptions> & PickupPoint & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, PickupPoint, any, import("mongoose").DefaultSchemaOptions> & PickupPoint & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, PickupPoint>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PickupPoint, Document<unknown, {}, PickupPoint, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PickupPoint & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    fromCity?: import("mongoose").SchemaDefinitionProperty<string, PickupPoint, Document<unknown, {}, PickupPoint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PickupPoint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    toCity?: import("mongoose").SchemaDefinitionProperty<string, PickupPoint, Document<unknown, {}, PickupPoint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PickupPoint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, PickupPoint, Document<unknown, {}, PickupPoint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PickupPoint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    departureTimeAndPlace?: import("mongoose").SchemaDefinitionProperty<string, PickupPoint, Document<unknown, {}, PickupPoint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PickupPoint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalDays?: import("mongoose").SchemaDefinitionProperty<number, PickupPoint, Document<unknown, {}, PickupPoint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PickupPoint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalNights?: import("mongoose").SchemaDefinitionProperty<number, PickupPoint, Document<unknown, {}, PickupPoint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PickupPoint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    priceAdjustment?: import("mongoose").SchemaDefinitionProperty<number, PickupPoint, Document<unknown, {}, PickupPoint, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PickupPoint & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PickupPoint>;
declare class FAQ {
    question: string;
    answer: string;
}
export declare class Tour {
    title: string;
    slug: string;
    description: string;
    duration: string;
    basePrice: number;
    minAge: number;
    maxAge: number;
    category: string;
    location: string;
    state: string;
    country: string;
    highlights: string[];
    departureOptions: PickupPoint[];
    itinerary: ItineraryDay[];
    inclusions: string[];
    exclusions: string[];
    faqs: FAQ[];
    images: string[];
    thumbnailImage: string;
    isActive: boolean;
    isFeatured: boolean;
    viewCount: number;
    averageRating: number;
    reviewCount: number;
    isDeleted: boolean;
    deletedAt: Date | null;
    brochureUrl: string;
}
export declare const TourSchema: import("mongoose").Schema<Tour, import("mongoose").Model<Tour, any, any, any, (Document<unknown, any, Tour, any, import("mongoose").DefaultSchemaOptions> & Tour & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Tour, any, import("mongoose").DefaultSchemaOptions> & Tour & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Tour>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Tour, Document<unknown, {}, Tour, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    duration?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    basePrice?: import("mongoose").SchemaDefinitionProperty<number, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minAge?: import("mongoose").SchemaDefinitionProperty<number, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    maxAge?: import("mongoose").SchemaDefinitionProperty<number, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    state?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    country?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    highlights?: import("mongoose").SchemaDefinitionProperty<string[], Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    departureOptions?: import("mongoose").SchemaDefinitionProperty<PickupPoint[], Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    itinerary?: import("mongoose").SchemaDefinitionProperty<ItineraryDay[], Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    inclusions?: import("mongoose").SchemaDefinitionProperty<string[], Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    exclusions?: import("mongoose").SchemaDefinitionProperty<string[], Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    faqs?: import("mongoose").SchemaDefinitionProperty<FAQ[], Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    images?: import("mongoose").SchemaDefinitionProperty<string[], Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    thumbnailImage?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isFeatured?: import("mongoose").SchemaDefinitionProperty<boolean, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    viewCount?: import("mongoose").SchemaDefinitionProperty<number, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    averageRating?: import("mongoose").SchemaDefinitionProperty<number, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reviewCount?: import("mongoose").SchemaDefinitionProperty<number, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isDeleted?: import("mongoose").SchemaDefinitionProperty<boolean, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | null, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    brochureUrl?: import("mongoose").SchemaDefinitionProperty<string, Tour, Document<unknown, {}, Tour, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Tour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Tour>;
export {};
