import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../../../database/schemas/booking.schema';
import { UserDocument } from '../../../database/schemas/user.schema';
import { TourDocument } from '../../../database/schemas/tour.schema';
import { ReviewDocument } from '../../../database/schemas/review.schema';
export declare class AdminDashboardService {
    private bookingModel;
    private userModel;
    private tourModel;
    private reviewModel;
    constructor(bookingModel: Model<BookingDocument>, userModel: Model<UserDocument>, tourModel: Model<TourDocument>, reviewModel: Model<ReviewDocument>);
    getSummary(): Promise<{
        totalBookings: number;
        totalRevenue: any;
        totalUsers: number;
        bookingsToday: number;
        revenueToday: any;
        activeTours: number;
        pendingReviews: number;
        stats: any;
    }>;
    getRevenueChart(period: 'daily' | 'monthly' | 'yearly'): Promise<{
        date: any;
        revenue: any;
    }[]>;
    getTopTours(limit?: number): Promise<any[]>;
    getRecentBookings(limit?: number): Promise<(import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
