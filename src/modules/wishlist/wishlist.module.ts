import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { Tour, TourSchema } from '../../database/schemas/tour.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Tour.name, schema: TourSchema },
        ]),
    ],
    providers: [WishlistService],
    controllers: [WishlistController],
    exports: [WishlistService],
})
export class WishlistModule { }
