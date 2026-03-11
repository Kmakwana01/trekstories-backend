"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../../../database/schemas/booking.schema");
const user_schema_1 = require("../../../database/schemas/user.schema");
const tour_schema_1 = require("../../../database/schemas/tour.schema");
const review_schema_1 = require("../../../database/schemas/review.schema");
const date_util_1 = require("../../../utils/date.util");
const booking_status_enum_1 = require("../../../common/enums/booking-status.enum");
const roles_enum_1 = require("../../../common/enums/roles.enum");
const review_status_enum_1 = require("../../../common/enums/review-status.enum");
let AdminDashboardService = class AdminDashboardService {
    bookingModel;
    userModel;
    tourModel;
    reviewModel;
    constructor(bookingModel, userModel, tourModel, reviewModel) {
        this.bookingModel = bookingModel;
        this.userModel = userModel;
        this.tourModel = tourModel;
        this.reviewModel = reviewModel;
    }
    async getSummary() {
        const today = date_util_1.DateUtil.startOfDayIST();
        const [totalBookings, totalUsers, totalRevenueData, bookingsToday, revenueTodayData, statusCounts, activeTours, pendingReviews,] = await Promise.all([
            this.bookingModel.countDocuments(),
            this.userModel.countDocuments({ role: roles_enum_1.Role.CUSTOMER }),
            this.bookingModel.aggregate([
                { $match: { status: { $ne: booking_status_enum_1.BookingStatus.CANCELLED } } },
                { $group: { _id: null, total: { $sum: '$paidAmount' } } },
            ]),
            this.bookingModel.countDocuments({ createdAt: { $gte: today } }),
            this.bookingModel.aggregate([
                {
                    $match: {
                        createdAt: { $gte: today },
                        status: { $ne: booking_status_enum_1.BookingStatus.CANCELLED },
                    },
                },
                { $group: { _id: null, total: { $sum: '$paidAmount' } } },
            ]),
            this.bookingModel.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            this.tourModel.countDocuments({ isActive: true }),
            this.reviewModel.countDocuments({ status: review_status_enum_1.ReviewStatus.PENDING }),
        ]);
        const totalRevenue = totalRevenueData[0]?.total || 0;
        const revenueToday = revenueTodayData[0]?.total || 0;
        const stats = {};
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
    async getRevenueChart(period) {
        let groupBy;
        if (period === 'daily') {
            groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        }
        else if (period === 'monthly') {
            groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        }
        else {
            groupBy = { $dateToString: { format: '%Y', date: '$createdAt' } };
        }
        const raw = await this.bookingModel.aggregate([
            {
                $match: {
                    status: { $ne: booking_status_enum_1.BookingStatus.CANCELLED },
                    paidAmount: { $gt: 0 },
                },
            },
            { $group: { _id: groupBy, revenue: { $sum: '$paidAmount' } } },
            { $sort: { _id: 1 } },
            { $limit: 30 },
        ]);
        return raw.map((item) => ({ date: item._id, revenue: item.revenue }));
    }
    async getTopTours(limit = 5) {
        const results = await this.bookingModel.aggregate([
            { $match: { status: { $ne: booking_status_enum_1.BookingStatus.CANCELLED } } },
            {
                $group: {
                    _id: '$tour',
                    bookingCount: { $sum: 1 },
                    revenue: { $sum: '$paidAmount' },
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
};
exports.AdminDashboardService = AdminDashboardService;
exports.AdminDashboardService = AdminDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(tour_schema_1.Tour.name)),
    __param(3, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminDashboardService);
//# sourceMappingURL=admin-dashboard.service.js.map