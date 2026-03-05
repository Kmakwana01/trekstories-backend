import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../../../database/schemas/booking.schema';
import { User, UserDocument } from '../../../database/schemas/user.schema';
import { Tour, TourDocument } from '../../../database/schemas/tour.schema';
import { Review, ReviewDocument } from '../../../database/schemas/review.schema';
import { DateUtil } from '../../../utils/date.util';
import { BookingStatus } from '../../../common/enums/booking-status.enum';
import { Role } from '../../../common/enums/roles.enum';
import { ReviewStatus } from '../../../common/enums/review-status.enum';

@Injectable()
export class AdminDashboardService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    ) { }

    async getSummary() {
        const today = DateUtil.startOfDayIST();

        const [
            totalBookings,
            totalUsers,
            totalRevenueData,
            bookingsToday,
            revenueTodayData,
            statusCounts,
            activeTours,
            pendingReviews,
        ] = await Promise.all([
            this.bookingModel.countDocuments(),
            this.userModel.countDocuments({ role: Role.CUSTOMER }),
            this.bookingModel.aggregate([
                { $match: { status: { $ne: BookingStatus.CANCELLED } } },
                { $group: { _id: null, total: { $sum: '$paidAmount' } } },
            ]),
            this.bookingModel.countDocuments({ createdAt: { $gte: today } }),
            this.bookingModel.aggregate([
                { $match: { createdAt: { $gte: today }, status: { $ne: BookingStatus.CANCELLED } } },
                { $group: { _id: null, total: { $sum: '$paidAmount' } } },
            ]),
            this.bookingModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.tourModel.countDocuments({ isActive: true }),
            this.reviewModel.countDocuments({ status: ReviewStatus.PENDING }),
        ]);

        const totalRevenue = totalRevenueData[0]?.total || 0;
        const revenueToday = revenueTodayData[0]?.total || 0;

        const stats: any = {};
        statusCounts.forEach((s) => {
            stats[s._id] = s.count;
        });

        return {
            totalBookings,
            totalRevenue,
            totalUsers,
            bookingsToday,
            revenueToday,
            activeTours,
            pendingReviews,
            stats,
        };
    }

    async getRevenueChart(period: 'daily' | 'monthly' | 'yearly') {
        let groupBy: any;

        if (period === 'daily')
        {
            groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        } else if (period === 'monthly')
        {
            groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        } else
        {
            groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } };
        }

        // Use bookings.paidAmount (same source as KPI total revenue)
        const raw = await this.bookingModel.aggregate([
            { $match: { status: { $ne: BookingStatus.CANCELLED }, paidAmount: { $gt: 0 } } },
            { $group: { _id: groupBy, revenue: { $sum: '$paidAmount' } } },
            { $sort: { _id: 1 } },
            { $limit: 30 },
        ]);

        return raw.map(item => ({ date: item._id, revenue: item.revenue }));
    }

    async getTopTours(limit = 5) {
        const results = await this.bookingModel.aggregate([
            { $match: { status: { $ne: BookingStatus.CANCELLED } } },
            {
                $group: {
                    _id: '$tour',
                    bookingCount: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' },
                },
            },
            { $sort: { bookingCount: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'tours',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'tourDetails',
                },
            },
            { $unwind: '$tourDetails' },
            {
                $project: {
                    _id: 1,
                    bookingCount: 1,
                    revenue: 1,
                    title: '$tourDetails.title',
                    slug: '$tourDetails.slug',
                    thumbnailImage: '$tourDetails.thumbnailImage',
                },
            },
        ]);

        return results;
    }

    async getRecentBookings(limit = 5) {
        return this.bookingModel
            .find()
            .populate('user', 'name email')
            .populate('tour', 'title thumbnailImage slug')
            .populate('tourDate', 'startDate')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
}
