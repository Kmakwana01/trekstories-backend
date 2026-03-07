import { AdminDashboardService } from '../services/admin-dashboard.service';
export declare class AdminDashboardController {
    private dashboardService;
    constructor(dashboardService: AdminDashboardService);
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
    getTopTours(limit: string): Promise<any[]>;
    getRecentBookings(limit: string): Promise<(import("mongoose").Document<unknown, {}, import("../../../database/schemas/booking.schema").BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../../database/schemas/booking.schema").Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
