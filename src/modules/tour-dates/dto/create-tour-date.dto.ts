import { IsNotEmpty, IsMongoId, IsDateString, IsNumber, Min, IsOptional, IsString, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { TourDateStatus } from '../../../common/enums/tour-date-status.enum';

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
    @IsEnum(TourDateStatus)
    @IsOptional()
    status?: string;
}
