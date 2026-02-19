import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt, Min, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class TravelerDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsInt()
    @Min(1)
    age: number;

    @IsEnum(['male', 'female', 'other'])
    gender: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    idNumber?: string;
}

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    tourDateId: string;

    @IsInt()
    @Min(0)
    pickupOptionIndex: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TravelerDto)
    travelers: TravelerDto[];

    @IsString()
    @IsOptional()
    couponCode?: string;

    @IsString()
    @IsOptional()
    additionalRequests?: string;
}
