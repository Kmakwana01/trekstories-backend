export declare class ItineraryPointDto {
    text: string;
    subPoints?: string[];
}
export declare class ItineraryDayDto {
    dayNumber: number;
    title: string;
    points: ItineraryPointDto[];
}
export declare class PickupPointDto {
    fromCity: string;
    toCity?: string;
    type: string;
    departureTimeAndPlace?: string;
    totalDays: number;
    totalNights: number;
    priceAdjustment?: number;
}
export declare class FAQDto {
    question: string;
    answer: string;
}
export declare class CreateTourDto {
    title: string;
    description?: string;
    basePrice: number;
    minAge?: number;
    maxAge?: number;
    category: string;
    location: string;
    state?: string;
    duration?: string;
    country?: string;
    highlights?: string[];
    departureOptions?: PickupPointDto[];
    itinerary?: ItineraryDayDto[];
    inclusions?: string[];
    exclusions?: string[];
    faqs?: FAQDto[];
    images?: string[];
    thumbnailImage?: string;
    isActive?: boolean;
    isFeatured?: boolean;
}
export declare class UpdateTourDto {
    title?: string;
    description?: string;
    basePrice?: number;
    minAge?: number;
    maxAge?: number;
    category?: string;
    location?: string;
    state?: string;
    country?: string;
    highlights?: string[];
    departureOptions?: PickupPointDto[];
    itinerary?: ItineraryDayDto[];
    inclusions?: string[];
    exclusions?: string[];
    faqs?: FAQDto[];
    images?: string[];
    thumbnailImage?: string;
    duration?: string;
    isActive?: boolean;
    isFeatured?: boolean;
}
