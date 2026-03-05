import { IsString, IsOptional, IsEmail, ValidateNested, IsBoolean, IsUrl, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BusinessDetailsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    upiId?: string;

    @ApiPropertyOptional({ description: 'GST rate as a percentage (e.g. 5 for 5%). Range: 0–28.' })
    @IsNumber()
    @Min(0)
    @Max(28)
    @IsOptional()
    gstRate?: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    alternatePhone?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    businessEmail?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    officeAddress?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    supportEmail?: string;
}

export class SocialMediaDto {
    @ApiPropertyOptional()
    @IsUrl()
    @IsOptional()
    facebook?: string;

    @ApiPropertyOptional()
    @IsUrl()
    @IsOptional()
    instagram?: string;

    @ApiPropertyOptional()
    @IsUrl()
    @IsOptional()
    twitter?: string;

    @ApiPropertyOptional()
    @IsUrl()
    @IsOptional()
    youtube?: string;

    @ApiPropertyOptional()
    @IsUrl()
    @IsOptional()
    linkedin?: string;

    @ApiPropertyOptional()
    @IsUrl()
    @IsOptional()
    whatsapp?: string;
}

export class PaymentDetailsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    upiQrImageUrl?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    bankAccountDetails?: string;
}

export class OtherSettingsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    footerDescription?: string;

    @ApiPropertyOptional()
    @IsEmail()
    @IsOptional()
    newsletterEmail?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    seoMetaTitle?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    seoMetaDescription?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    logoUrl?: string;
}

export class UpdateSettingDto {
    @ApiPropertyOptional({ type: BusinessDetailsDto })
    @ValidateNested()
    @Type(() => BusinessDetailsDto)
    @IsOptional()
    businessDetails?: BusinessDetailsDto;

    @ApiPropertyOptional({ type: SocialMediaDto })
    @ValidateNested()
    @Type(() => SocialMediaDto)
    @IsOptional()
    socialMedia?: SocialMediaDto;

    @ApiPropertyOptional({ type: PaymentDetailsDto })
    @ValidateNested()
    @Type(() => PaymentDetailsDto)
    @IsOptional()
    paymentDetails?: PaymentDetailsDto;

    @ApiPropertyOptional({ type: OtherSettingsDto })
    @ValidateNested()
    @Type(() => OtherSettingsDto)
    @IsOptional()
    otherSettings?: OtherSettingsDto;
}
