import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../../../database/schemas/booking.schema';
import { User, UserDocument } from '../../../database/schemas/user.schema';
import { Tour, TourDocument } from '../../../database/schemas/tour.schema';
import { Transaction, TransactionDocument } from '../../../database/schemas/transaction.schema';

@Injectable()
export class AdminDashboardService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    ) { }

    async getSummary() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            totalBookings,
            totalUsers,
            totalRevenueData,
            bookingsToday,
            revenueTodayData,
            statusCounts,
        ] = await Promise.all([
            this.bookingModel.countDocuments(),
            this.userModel.countDocuments({ role: 'customer' }),
            this.bookingModel.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$paidAmount' } } },
            ]),
            this.bookingModel.countDocuments({ createdAt: { $gte: today } }),
            this.bookingModel.aggregate([
                { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: '$paidAmount' } } },
            ]),
            this.bookingModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
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

        return this.transactionModel.aggregate([
            { $match: { type: 'payment', status: 'success' } },
            { $group: { _id: groupBy, revenue: { $sum: '$amount' } } },
            { $sort: { _id: 1 } },
            { $limit: 30 },
        ]);
    }

    async getTopTours(limit = 5) {
        return this.bookingModel.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: '$tour', bookingCount: { $sum: 1 } } },
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
                    title: '$tourDetails.title',
                    slug: '$tourDetails.slug',
                },
            },
        ]);
    }
}
