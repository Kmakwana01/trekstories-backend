import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get()
    async getWishlist(@CurrentUser('_id') userId: string) {
        return this.wishlistService.getWishlist(userId);
    }

    @Post(':tourId')
    async addToWishlist(@CurrentUser('_id') userId: string, @Param('tourId') tourId: string) {
        return this.wishlistService.addToWishlist(userId, tourId);
    }

    @Delete(':tourId')
    async removeFromWishlist(@CurrentUser('_id') userId: string, @Param('tourId') tourId: string) {
        return this.wishlistService.removeFromWishlist(userId, tourId);
    }

    @Post(':tourId/toggle')
    async toggleWishlist(@CurrentUser('_id') userId: string, @Param('tourId') tourId: string) {
        return this.wishlistService.toggleWishlist(userId, tourId);
    }
}
