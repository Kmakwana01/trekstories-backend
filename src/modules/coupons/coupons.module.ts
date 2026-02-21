import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponsService } from './coupons.service';
import { CouponsController, AdminCouponsController } from './coupons.controller';
import { Coupon, CouponSchema } from '../../database/schemas/coupon.schema';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import { AdminModule } from '../admin/admin.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Coupon.name, schema: CouponSchema },
            { name: Booking.name, schema: BookingSchema }
        ]),
        AdminModule,
    ],
    controllers: [CouponsController, AdminCouponsController],
    providers: [CouponsService],
    exports: [CouponsService],
})
export class CouponsModule { }
