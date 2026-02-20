import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class BulkEmailDto {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    emails: string[];

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsOptional()
    templateName?: string;

    @IsOptional()
    templateData?: any;
}
