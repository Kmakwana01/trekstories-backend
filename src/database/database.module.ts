import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UserSchema } from './schemas/user.schema';
import { TourSchema } from './schemas/tour.schema';
import { TourDateSchema } from './schemas/tour-date.schema';
import { BookingSchema } from './schemas/booking.schema';
import { PaymentSchema } from './schemas/payment.schema';
import { TransactionSchema } from './schemas/transaction.schema';
import { BlogSchema } from './schemas/blog.schema';
import { ReviewSchema } from './schemas/review.schema';
import { CouponSchema } from './schemas/coupon.schema';
import { NotificationSchema } from './schemas/notification.schema';
import { AdminLogSchema } from './schemas/admin-log.schema';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('database.uri'),
            }),
        }),
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
            { name: 'Tour', schema: TourSchema },
            { name: 'TourDate', schema: TourDateSchema },
            { name: 'Booking', schema: BookingSchema },
            { name: 'Payment', schema: PaymentSchema },
            { name: 'Transaction', schema: TransactionSchema },
            { name: 'Blog', schema: BlogSchema },
            { name: 'Review', schema: ReviewSchema },
            { name: 'Coupon', schema: CouponSchema },
            { name: 'Notification', schema: NotificationSchema },
            { name: 'AdminLog', schema: AdminLogSchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { }
