import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItineraryPointDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    subPoints?: string[];
}

class ItineraryDayDto {
    @IsInt()
    @Min(1)
    dayNumber: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItineraryPointDto)
    points: ItineraryPointDto[];
}

class PickupPointDto {
    @IsString()
    @IsOptional()
    fromCity?: string;

    @IsString()
    @IsOptional()
    toCity?: string;

    @IsEnum(['AC', 'NON-AC', 'FLIGHT', 'TRAIN'])
    type: string;

    @IsString()
    @IsOptional()
    departureTimeAndPlace?: string;

    @IsInt()
    @Min(1)
    totalDays: number;

    @IsInt()
    @Min(0)
    totalNights: number;

    @IsNumber()
    @IsOptional()
    priceAdjustment?: number = 0;
}

class FAQDto {
    @IsString()
    @IsNotEmpty()
    question: string;

    @IsString()
    @IsNotEmpty()
    answer: string;
}

export class CreateTourDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    basePrice: number;

    @IsInt()
    @IsOptional()
    minAge?: number;

    @IsInt()
    @IsOptional()
    maxAge?: number;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    highlights?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PickupPointDto)
    @IsOptional()
    departureOptions?: PickupPointDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItineraryDayDto)
    @IsOptional()
    itinerary?: ItineraryDayDto[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    inclusions?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    exclusions?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FAQDto)
    @IsOptional()
    faqs?: FAQDto[];

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;
}

export class UpdateTourDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    basePrice?: number;

    @IsInt()
    @IsOptional()
    minAge?: number;

    @IsInt()
    @IsOptional()
    maxAge?: number;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    highlights?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PickupPointDto)
    @IsOptional()
    departureOptions?: PickupPointDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItineraryDayDto)
    @IsOptional()
    itinerary?: ItineraryDayDto[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    inclusions?: string[];

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    exclusions?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FAQDto)
    @IsOptional()
    faqs?: FAQDto[];

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;
}
