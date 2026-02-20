import { IsString, IsNotEmpty } from 'class-validator';

export class RejectReviewDto {
    @IsString()
    @IsNotEmpty()
    reason: string;
}
