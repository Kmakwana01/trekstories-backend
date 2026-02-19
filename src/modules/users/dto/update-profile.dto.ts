import { IsEmail, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEnum(['male', 'female', 'other'])
    @IsOptional()
    gender?: string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?: Date;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    contactAddress?: string;
}
