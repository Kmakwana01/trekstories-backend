import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be valid international format' })
    phone: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;

    @IsEnum(['male', 'female', 'other'], { message: 'Gender must be male, female, or other' })
    @IsOptional()
    gender?: string;

    @IsDateString({}, { message: 'dateOfBirth must be a valid ISO date' })
    @IsOptional()
    dateOfBirth?: string;
}
