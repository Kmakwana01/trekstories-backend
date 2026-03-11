import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  @IsNotEmpty()
  bookingId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
