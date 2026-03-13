import { HomeService } from './home.service';
import type { UserDocument } from '../../database/schemas/user.schema';
export declare class HomeController {
    private readonly homeService;
    constructor(homeService: HomeService);
    getHomeData(): Promise<{}>;
    getFeaturedTours(): Promise<{}>;
    getUpcomingDepartures(): Promise<{}>;
    getActiveOffers(): Promise<{}>;
    getLatestBlogs(): Promise<any[]>;
    getToursByState(): Promise<any[]>;
    getToursByStateName(state: string, page: string, limit: string): Promise<{
        tours: (import("mongoose").Document<unknown, {}, import("../../database/schemas/tour.schema").TourDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/tour.schema").Tour & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getRecentlyViewed(user: UserDocument): Promise<(import("mongoose").Document<unknown, {}, import("../../database/schemas/tour.schema").TourDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../database/schemas/tour.schema").Tour & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
