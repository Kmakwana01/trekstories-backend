import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/schemas/user.schema';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: User,
  ) {
    try {
      return await this.reviewsService.create(
        (user as any)._id.toString(),
        createReviewDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @Get('tours/:tourId/reviews')
  async findAllByTour(
    @Param('tourId') tourId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewsService.findAllByTour(
      tourId,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get('users/my-reviews')
  @UseGuards(JwtAuthGuard)
  findAllMyReviews(@CurrentUser() user: User) {
    return this.reviewsService.findAllByUser((user as any)._id.toString());
  }
}
