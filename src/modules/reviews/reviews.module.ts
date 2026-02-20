import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { AdminReviewsController } from './admin-reviews.controller';
import { Review, ReviewSchema } from '../../database/schemas/review.schema';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import { Tour, TourSchema } from '../../database/schemas/tour.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Review.name, schema: ReviewSchema },
            { name: Booking.name, schema: BookingSchema },
            { name: Tour.name, schema: TourSchema },
        ]),
    ],
    controllers: [ReviewsController, AdminReviewsController],
    providers: [ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule { }
