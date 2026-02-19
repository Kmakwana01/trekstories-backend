import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { AdminBookingsController } from './admin-bookings.controller';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import { Tour, TourSchema } from '../../database/schemas/tour.schema';
import { TourDate, TourDateSchema } from '../../database/schemas/tour-date.schema';
import { Coupon, CouponSchema } from '../../database/schemas/coupon.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Booking.name, schema: BookingSchema },
            { name: Tour.name, schema: TourSchema },
            { name: TourDate.name, schema: TourDateSchema },
            { name: 'Coupon', schema: CouponSchema },
        ]),
    ],
    providers: [BookingsService],
    controllers: [BookingsController, AdminBookingsController],
    exports: [BookingsService],
})
export class BookingsModule { }
