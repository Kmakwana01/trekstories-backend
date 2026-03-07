export declare class CreateTourDateDto {
    tour: string;
    startDate: string;
    endDate: string;
    totalSeats: number;
    priceOverride?: number;
    departureNote?: string;
}
declare const UpdateTourDateDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateTourDateDto>>;
export declare class UpdateTourDateDto extends UpdateTourDateDto_base {
    status?: string;
}
export {};
