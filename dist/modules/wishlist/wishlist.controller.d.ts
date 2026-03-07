import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(userId: string): Promise<import("../../database/schemas/tour.schema").Tour[]>;
    addToWishlist(userId: string, tourId: string): Promise<import("../../database/schemas/user.schema").User>;
    removeFromWishlist(userId: string, tourId: string): Promise<import("../../database/schemas/user.schema").User>;
    toggleWishlist(userId: string, tourId: string): Promise<{
        added: boolean;
        user: import("../../database/schemas/user.schema").User;
    }>;
}
