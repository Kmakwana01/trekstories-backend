import { IsEmail, IsNotEmpty, IsString, MinLength, Length } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
    otp: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    newPassword: string;
}
