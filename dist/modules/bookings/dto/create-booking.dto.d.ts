declare class TravelerDto {
    fullName: string;
    age: number;
    gender?: string;
    phone?: string;
    idNumber?: string;
}
export declare class CreateBookingDto {
    tourDateId: string;
    pickupOptionIndex: number;
    travelers: TravelerDto[];
    couponCode?: string;
    additionalRequests?: string;
    paymentType?: 'FULL' | 'PARTIAL';
    partialAmount?: number;
}
export {};
