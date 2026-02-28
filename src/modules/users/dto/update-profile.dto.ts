import { IsEmail, IsEnum, IsOptional, IsString, IsDateString, IsNotEmpty, Matches } from 'class-validator';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be valid international format' })
    phone: string;

    @IsEnum(['male', 'female', 'other'], { message: 'Gender must be male, female, or other' })
    @IsOptional()
    gender?: string;

    @IsDateString({}, { message: 'dateOfBirth must be a valid ISO date' })
    @IsOptional()
    dateOfBirth?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    contactAddress?: string;

    @IsString()
    @IsOptional()
    avatar?: string;
}
