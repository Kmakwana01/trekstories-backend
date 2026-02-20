import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { HomeService } from './home.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserDocument } from '../../database/schemas/user.schema';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Get('featured-tours')
    async getFeaturedTours() {
        return this.homeService.getFeaturedTours();
    }

    @Get('upcoming-departures')
    async getUpcomingDepartures() {
        return this.homeService.getUpcomingDepartures();
    }

    @Get('offers')
    async getActiveOffers() {
        return this.homeService.getActiveOffers();
    }

    @Get('blogs')
    async getLatestBlogs() {
        return this.homeService.getLatestBlogs();
    }

    @Get('tours-by-state')
    async getToursByState() {
        return this.homeService.getToursByState();
    }

    @Get('tours-by-state/:state')
    async getToursByStateName(
        @Param('state') state: string,
        @Query('page') page: string,
        @Query('limit') limit: string,
    ) {
        return this.homeService.getToursByStateName(
            state,
            parseInt(page) || 1,
            parseInt(limit) || 10,
        );
    }

    @Get('recently-viewed')
    @UseGuards(JwtAuthGuard)
    async getRecentlyViewed(@CurrentUser() user: UserDocument) {
        return this.homeService.getRecentlyViewedTours(user._id.toString());
    }
}
