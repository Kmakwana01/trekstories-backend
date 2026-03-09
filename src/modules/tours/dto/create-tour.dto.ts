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
import { Type, Transform, Expose, plainToInstance } from 'class-transformer';
import { TourCategory } from '../../../common/enums/tour-category.enum';
import { PickupType } from '../../../common/enums/pickup-type.enum';

// ---------------------------------------------------------------------------
// Helper transforms
// ---------------------------------------------------------------------------

/**
 * Parses a JSON-string value OR accepts an already-parsed object/array.
 * When a `type` class is supplied, each element/object is run through
 * plainToInstance so its own @Transform decorators fire (e.g. @ParseNumber).
 */
const ParseJson = (type?: any) =>
    Transform(({ value }) => {
        // ── Case 1: JSON string (e.g. '[{"type":"AC","totalDays":2}]') ──────────
        if (typeof value === 'string')
        {
            try
            {
                const parsed = JSON.parse(value);
                if (type)
                {
                    return plainToInstance(type, parsed, {
                        enableImplicitConversion: true,
                        excludeExtraneousValues: false,
                    });
                }
                return parsed;
            } catch
            {
                return value; // not valid JSON – pass through as-is
            }
        }

        // ── Case 2: Already an object/array (reconstructed from bracket notation) ─
        if (type && (Array.isArray(value) || (typeof value === 'object' && value !== null)))
        {
            return plainToInstance(type, value, {
                enableImplicitConversion: true,
                excludeExtraneousValues: false,
            });
        }

        return value;
    });

/**
 * Coerces a value to boolean.
 * Handles the string representations sent by FormData.
 */
const ParseBoolean = () =>
    Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        if (value === '' || value === undefined || value === null) return undefined;
        return value;
    });

/**
 * Coerces a value to number.
 * Works for string "2", numeric 2, and ignores empty/null.
 */
const ParseNumber = () =>
    Transform(({ value }) => {
        if (value === '' || value === null || value === undefined) return undefined;
        // Already a number (e.g. came from JSON.parse or bracket-notation parsed by qs)
        if (typeof value === 'number' && !isNaN(value)) return value;
        if (typeof value === 'string')
        {
            const num = Number(value);
            if (!isNaN(num)) return num;
        }
        return value;
    });

/**
 * Trims and uppercases a string value.
 * Required for enum fields because FormData values are raw strings and
 * class-validator's @IsEnum is case-sensitive.
 */
const ParseUppercase = () =>
    Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toUpperCase() : value,
    );

// ---------------------------------------------------------------------------
// Nested DTOs
// ---------------------------------------------------------------------------

export class ItineraryPointDto {
    @Expose()
    @IsString()
    @IsNotEmpty()
    text: string;

    @Expose()
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    subPoints?: string[];
}

export class ItineraryDayDto {
    @Expose()
    @ParseNumber()
    @IsInt()
    @Min(1)
    dayNumber: number;

    @Expose()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Expose()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItineraryPointDto)
    points: ItineraryPointDto[];
}

export class PickupPointDto {
    @Expose()
    @IsString()
    @IsNotEmpty({ message: 'Route Start is required' })
    fromCity: string;

    @Expose()
    @IsString()
    @IsOptional()
    toCity?: string;

    /**
     * FIX: FormData sends "ac" / "AC" / " AC " as plain strings.
     * @ParseUppercase trims and uppercases before @IsEnum runs.
     */
    @Expose()
    @ParseUppercase()
    @IsEnum(PickupType)
    type: string;

    @Expose()
    @IsString()
    @IsOptional()
    departureTimeAndPlace?: string;

    @Expose()
    @ParseNumber()
    @IsNumber()
    @Min(1)
    totalDays: number;

    @Expose()
    @ParseNumber()
    @IsNumber()
    @Min(0)
    totalNights: number;

    @Expose()
    @ParseNumber()
    @IsNumber()
    @IsOptional()
    priceAdjustment?: number;
}

export class FAQDto {
    @Expose()
    @IsString()
    @IsNotEmpty({ message: 'Question is required' })
    question: string;

    @Expose()
    @IsString()
    @IsNotEmpty({ message: 'Answer is required' })
    answer: string;
}

// ---------------------------------------------------------------------------
// CreateTourDto
// ---------------------------------------------------------------------------

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

    /**
     * FIX: Uppercase before enum validation.
     */
    @ParseUppercase()
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

    @ParseJson(PickupPointDto)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PickupPointDto)
    @IsOptional()
    departureOptions?: PickupPointDto[];

    @ParseJson(ItineraryDayDto)
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

    @ParseJson(FAQDto)
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

// ---------------------------------------------------------------------------
// UpdateTourDto
// ---------------------------------------------------------------------------

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

    /**
     * FIX: Uppercase before enum validation.
     */
    @ParseUppercase()
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

    @ParseJson(PickupPointDto)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PickupPointDto)
    @IsOptional()
    departureOptions?: PickupPointDto[];

    @ParseJson(ItineraryDayDto)
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

    @ParseJson(FAQDto)
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