import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { Tour } from '../../database/schemas/tour.schema';
import type { TourDocument } from '../../database/schemas/tour.schema';
import type { TourDateDocument } from '../../database/schemas/tour-date.schema';
import type { BlogDocument } from '../../database/schemas/blog.schema';
import type { CouponDocument } from '../../database/schemas/coupon.schema';
import type { SettingDocument } from '../../database/schemas/setting.schema';
export declare class HomeService {
    private tourModel;
    private tourDateModel;
    private blogModel;
    private couponModel;
    private settingModel;
    private cacheManager;
    constructor(tourModel: Model<TourDocument>, tourDateModel: Model<TourDateDocument>, blogModel: Model<BlogDocument>, couponModel: Model<CouponDocument>, settingModel: Model<SettingDocument>, cacheManager: Cache);
    getHomeData(): Promise<{}>;
    getFeaturedTours(): Promise<{}>;
    getUpcomingDepartures(): Promise<{}>;
    getActiveOffers(): Promise<{}>;
    getLatestBlogs(): Promise<any[]>;
    getToursByState(): Promise<any[]>;
    getToursByStateName(state: string, page?: number, limit?: number): Promise<{
        tours: (import("mongoose").Document<unknown, {}, TourDocument, {}, import("mongoose").DefaultSchemaOptions> & Tour & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    getRecentlyViewedTours(userId: string): Promise<(import("mongoose").Document<unknown, {}, TourDocument, {}, import("mongoose").DefaultSchemaOptions> & Tour & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
