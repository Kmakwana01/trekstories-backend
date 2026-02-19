import { IsString, IsNotEmpty, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class PreviewBookingDto {
    @IsString()
    @IsNotEmpty()
    tourDateId: string;

    @IsInt()
    @Min(0)
    pickupOptionIndex: number;

    @IsInt()
    @Min(1)
    travelerCount: number;

    @IsString()
    @IsOptional()
    couponCode?: string;
}
