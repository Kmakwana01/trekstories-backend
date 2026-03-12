import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomTourStatus } from '../schemas/custom-tour-request.schema';

export class FilterCustomTourRequestDto {
    @IsOptional()
    @IsEnum(CustomTourStatus)
    status?: CustomTourStatus;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number;
}

export class UpdateCustomTourStatusDto {
    @IsEnum(CustomTourStatus)
    status: CustomTourStatus;

    @IsOptional()
    @IsString()
    adminNotes?: string;
}
