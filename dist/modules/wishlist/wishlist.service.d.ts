import { Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { Tour, TourDocument } from '../../database/schemas/tour.schema';
export declare class WishlistService {
    private userModel;
    private tourModel;
    constructor(userModel: Model<UserDocument>, tourModel: Model<TourDocument>);
    addToWishlist(userId: string, tourId: string): Promise<User>;
    removeFromWishlist(userId: string, tourId: string): Promise<User>;
    getWishlist(userId: string): Promise<Tour[]>;
    toggleWishlist(userId: string, tourId: string): Promise<{
        added: boolean;
        user: User;
    }>;
}
