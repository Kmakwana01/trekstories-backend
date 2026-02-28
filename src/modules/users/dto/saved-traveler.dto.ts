import { IsEnum, IsInt, IsNotEmpty, IsString, Min, IsOptional } from 'class-validator';
import { Gender } from '../../../common/enums/gender.enum';

export class SavedTravelerDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsInt()
    @Min(0)
    age: number;

    @IsEnum(Gender)
    @IsOptional()
    gender?: string;

    @IsString()
    @IsOptional()
    idNumber?: string;
}
