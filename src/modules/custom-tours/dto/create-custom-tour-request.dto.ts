import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomTourRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    destination: string;

    @IsOptional()
    @IsString()
    travelDates?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    groupSize?: number;

    @IsOptional()
    @IsString()
    budget?: string;

    @IsOptional()
    @IsString()
    tourType?: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}
