import { IsNotEmpty, IsMongoId, IsDateString, IsNumber, Min, IsOptional, IsString, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTourDateDto {
    @IsMongoId()
    @IsNotEmpty()
    tour: string;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    totalSeats: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    priceOverride?: number;

    @IsString()
    @IsOptional()
    departureNote?: string;
}

export class UpdateTourDateDto extends PartialType(CreateTourDateDto) {
    @IsEnum(['upcoming', 'full', 'completed', 'cancelled'])
    @IsOptional()
    status?: string;
}
