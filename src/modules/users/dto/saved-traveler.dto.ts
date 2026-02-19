import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class SavedTravelerDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsInt()
    @Min(0)
    age: number;

    @IsEnum(['male', 'female', 'other'])
    gender: string;

    @IsString()
    @IsNotEmpty()
    idNumber: string;
}
