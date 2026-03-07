import {
    IsString,
    IsOptional,
    IsNotEmpty,
    IsUrl,
    IsBoolean,
    IsNumber,
    Min,
    ValidateNested,
    IsObject,
} from 'class-validator';
import { Type, Transform, plainToInstance } from 'class-transformer';

export class SocialLinksDto {
    @IsOptional()
    @IsUrl({}, { message: 'Facebook URL must be valid' })
    facebook?: string;

    @IsOptional()
    @IsUrl({}, { message: 'Instagram URL must be valid' })
    instagram?: string;

    @IsOptional()
    @IsUrl({}, { message: 'Twitter URL must be valid' })
    twitter?: string;

    @IsOptional()
    @IsUrl({}, { message: 'LinkedIn URL must be valid' })
    linkedin?: string;

    @IsOptional()
    @IsUrl({}, { message: 'YouTube URL must be valid' })
    youtube?: string;
}

export class CreateTeamMemberDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    designation: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    image?: string;

    @IsOptional()
    @Transform(({ value }) => {
        let parsed = value;
        if (typeof value === 'string')
        {
            try { parsed = JSON.parse(value); }
            catch { parsed = {}; }
        }
        return plainToInstance(SocialLinksDto, parsed);
    })
    @IsObject()
    @ValidateNested()
    socialLinks?: SocialLinksDto;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    order?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    isActive?: boolean;
}
