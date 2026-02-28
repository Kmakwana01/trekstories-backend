import { IsEmail, IsEnum, IsOptional, IsString, IsDateString, IsNotEmpty, Matches } from 'class-validator';
import { Gender } from '../../../common/enums/gender.enum';

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be valid international format' })
    phone: string;

    @IsEnum(Gender, { message: 'Gender must be a valid enum value' })
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
