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

export class PolicyContentDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    privacyPolicy?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    termsAndConditions?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    refundPolicy?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    cancellationPolicy?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    bookingInstructions?: string;
}

export class HeroContentDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    heroTitle?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    heroSubtitle?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    heroCta?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    heroCtaUrl?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    heroBannerImage?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    heroHighlights?: string[];
}

export class WhyChooseUsItemDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    icon?: string;
}

export class AboutContentDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    heroTitle?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    heroSubtitle?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    missionStatement?: string;

    @ApiPropertyOptional({ type: [WhyChooseUsItemDto] })
    @ValidateNested({ each: true })
    @Type(() => WhyChooseUsItemDto)
    @IsOptional()
    whyChooseUs?: WhyChooseUsItemDto[];
}

export class JobListingDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    location?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    type?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    applyUrl?: string;
}

export class CareerContentDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    heroTitle?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    heroSubtitle?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    cultureDescription?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ each: true })
    benefits?: string[];

    @ApiPropertyOptional({ type: [JobListingDto] })
    @ValidateNested({ each: true })
    @Type(() => JobListingDto)
    @IsOptional()
    jobs?: JobListingDto[];
}

export class FaqItemDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    question?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    answer?: string;
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

    @ApiPropertyOptional({ type: PolicyContentDto })
    @ValidateNested()
    @Type(() => PolicyContentDto)
    @IsOptional()
    policies?: PolicyContentDto;

    @ApiPropertyOptional({ type: HeroContentDto })
    @ValidateNested()
    @Type(() => HeroContentDto)
    @IsOptional()
    heroContent?: HeroContentDto;

    @ApiPropertyOptional({ type: AboutContentDto })
    @ValidateNested()
    @Type(() => AboutContentDto)
    @IsOptional()
    aboutContent?: AboutContentDto;

    @ApiPropertyOptional({ type: CareerContentDto })
    @ValidateNested()
    @Type(() => CareerContentDto)
    @IsOptional()
    careerContent?: CareerContentDto;

    @ApiPropertyOptional({ type: [FaqItemDto] })
    @ValidateNested({ each: true })
    @Type(() => FaqItemDto)
    @IsOptional()
    faqs?: FaqItemDto[];
}
