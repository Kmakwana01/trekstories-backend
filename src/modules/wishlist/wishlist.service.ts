import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Tour, TourDocument } from '../../database/schemas/tour.schema';

@Injectable()
export class WishlistService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    ) { }

    async addToWishlist(userId: string, tourId: string): Promise<User> {
        const tour = await this.tourModel.findById(tourId);
        if (!tour || !tour.isActive)
        {
            throw new NotFoundException('Tour not found or is inactive');
        }

        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: tourId } as any },
            { new: true }
        ).populate('wishlist').exec();

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async removeFromWishlist(userId: string, tourId: string): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: tourId } as any },
            { new: true }
        ).populate('wishlist').exec();

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async getWishlist(userId: string): Promise<Tour[]> {
        const user = await this.userModel.findById(userId)
            .populate({
                path: 'wishlist',
                select: 'title slug thumbnailImage basePrice averageRating state location category'
            })
            .exec();

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        return user.wishlist as unknown as Tour[];
    }

    async toggleWishlist(userId: string, tourId: string): Promise<{ added: boolean; user: User }> {
        const user = await this.userModel.findById(userId);
        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        const tourExists = user.wishlist.some(id => id.toString() === tourId);

        if (tourExists)
        {
            const updatedUser = await this.removeFromWishlist(userId, tourId);
            return { added: false, user: updatedUser };
        } else
        {
            const updatedUser = await this.addToWishlist(userId, tourId);
            return { added: true, user: updatedUser };
        }
    }
}
