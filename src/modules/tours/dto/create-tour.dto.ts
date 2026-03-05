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
import { Type, Transform } from 'class-transformer';
import { TourCategory } from '../../../common/enums/tour-category.enum';
import { PickupType } from '../../../common/enums/pickup-type.enum';

const ParseJson = () => Transform(({ value }) => {
    if (typeof value === 'string')
    {
        try
        {
            return JSON.parse(value);
        } catch (e)
        {
            return value;
        }
    }
    return value;
});

const ParseBoolean = () => Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
});

const ParseNumber = () => Transform(({ value }) => {
    if (typeof value === 'string' && !isNaN(Number(value)))
    {
        return Number(value);
    }
    return value;
});

export class ItineraryPointDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    subPoints?: string[];
}

export class ItineraryDayDto {
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

export class PickupPointDto {
    @IsString()
    @IsOptional()
    fromCity?: string;

    @IsString()
    @IsOptional()
    toCity?: string;

    @IsEnum(PickupType)
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    departureTimeAndPlace?: string;

    @IsInt()
    @Min(1)
    @Type(() => Number)
    totalDays: number;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    totalNights: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    priceAdjustment?: number = 0;
}

export class FAQDto {
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

    @ParseNumber()
    @IsNumber()
    @Min(0)
    basePrice: number;

    @ParseNumber()
    @IsInt()
    @IsOptional()
    minAge?: number;

    @ParseNumber()
    @IsInt()
    @IsOptional()
    maxAge?: number;

    @IsEnum(TourCategory)
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    duration?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @ParseJson()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    highlights?: string[];

    @ParseJson()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PickupPointDto)
    @IsOptional()
    departureOptions?: PickupPointDto[];

    @ParseJson()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItineraryDayDto)
    @IsOptional()
    itinerary?: ItineraryDayDto[];

    @ParseJson()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    inclusions?: string[];

    @ParseJson()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    exclusions?: string[];

    @ParseJson()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FAQDto)
    @IsOptional()
    faqs?: FAQDto[];

    @ParseJson()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsString()
    @IsOptional()
    thumbnailImage?: string;

    @ParseBoolean()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ParseBoolean()
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

    @ParseNumber()
    @IsNumber()
    @Min(0)
    @IsOptional()
    basePrice?: number;

    @ParseNumber()
    @IsInt()
    @IsOptional()
    minAge?: number;

    @ParseNumber()
    @IsInt()
    @IsOptional()
    maxAge?: number;

    @IsEnum(TourCategory)
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

    @ParseJson()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    highlights?: string[];

    @ParseJson()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PickupPointDto)
    @IsOptional()
    departureOptions?: PickupPointDto[];

    @ParseJson()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItineraryDayDto)
    @IsOptional()
    itinerary?: ItineraryDayDto[];

    @ParseJson()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    inclusions?: string[];

    @ParseJson()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    exclusions?: string[];

    @ParseJson()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FAQDto)
    @IsOptional()
    faqs?: FAQDto[];

    @IsString()
    @IsOptional()
    thumbnailImage?: string;

    @IsString()
    @IsOptional()
    duration?: string;

    @ParseBoolean()
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ParseBoolean()
    @IsBoolean()
    @IsOptional()
    isFeatured?: boolean;
}
