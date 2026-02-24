import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQuery } from '../../../common/helpers/pagination.helper';

export class TourFiltersDto extends PaginationQuery {
    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    state?: string | string[];

    @IsString()
    @IsOptional()
    category?: string | string[];

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    priceMin?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    priceMax?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    durationDays?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    minDuration?: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @Min(1)
    maxDuration?: number;

    @IsString()
    @IsOptional()
    departureCity?: string;
}
