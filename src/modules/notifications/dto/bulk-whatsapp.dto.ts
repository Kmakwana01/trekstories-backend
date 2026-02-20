import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class BulkWhatsAppDto {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    phones: string[];

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsOptional()
    templateName?: string;

    @IsOptional()
    templateData?: any;
}
