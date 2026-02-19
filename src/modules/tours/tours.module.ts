import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tour, TourSchema } from '../../database/schemas/tour.schema';
import { TourDate, TourDateSchema } from '../../database/schemas/tour-date.schema';
import { Review, ReviewSchema } from '../../database/schemas/review.schema';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { AdminToursController } from './admin-tours.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Tour.name, schema: TourSchema },
            { name: TourDate.name, schema: TourDateSchema },
            { name: 'Review', schema: ReviewSchema },
        ]),
    ],
    controllers: [ToursController, AdminToursController],
    providers: [ToursService],
    exports: [ToursService],
})
export class ToursModule { }
