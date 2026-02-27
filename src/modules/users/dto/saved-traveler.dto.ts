import { IsEnum, IsInt, IsNotEmpty, IsString, Min, IsOptional } from 'class-validator';

export class SavedTravelerDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsInt()
    @Min(0)
    age: number;

    @IsEnum(['male', 'female', 'other'])
    @IsOptional()
    gender?: string;

    @IsString()
    @IsOptional()
    idNumber?: string;
}
