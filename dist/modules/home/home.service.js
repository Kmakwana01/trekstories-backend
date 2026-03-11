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
exports.HomeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const date_util_1 = require("../../utils/date.util");
const tour_schema_1 = require("../../database/schemas/tour.schema");
const tour_date_schema_1 = require("../../database/schemas/tour-date.schema");
const blog_schema_1 = require("../../database/schemas/blog.schema");
const coupon_schema_1 = require("../../database/schemas/coupon.schema");
const setting_schema_1 = require("../../database/schemas/setting.schema");
const tour_date_status_enum_1 = require("../../common/enums/tour-date-status.enum");
let HomeService = class HomeService {
    tourModel;
    tourDateModel;
    blogModel;
    couponModel;
    settingModel;
    cacheManager;
    constructor(tourModel, tourDateModel, blogModel, couponModel, settingModel, cacheManager) {
        this.tourModel = tourModel;
        this.tourDateModel = tourDateModel;
        this.blogModel = blogModel;
        this.couponModel = couponModel;
        this.settingModel = settingModel;
        this.cacheManager = cacheManager;
    }
    async getHomeData() {
        const cacheKey = 'home_data_payload';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const [states, categories, departureCities, featuredTours, toursByState, latestBlogs, settings,] = await Promise.all([
            this.tourModel.distinct('state', { isActive: true }),
            this.tourModel.distinct('category', { isActive: true }),
            this.tourModel.distinct('departureOptions.fromCity', { isActive: true }),
            this.tourModel
                .find({ isFeatured: true, isActive: true })
                .lean()
                .limit(6)
                .exec(),
            this.tourModel.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: '$state',
                        tourCount: { $sum: 1 },
                        sampleTours: { $push: '$$ROOT' },
                    },
                },
                {
                    $project: {
                        state: '$_id',
                        tourCount: 1,
                        sampleTours: { $slice: ['$sampleTours', 3] },
                        _id: 0,
                    },
                },
                { $sort: { tourCount: -1 } },
            ]),
            this.blogModel.aggregate([
                { $match: { isPublished: true } },
                { $sample: { size: 5 } },
            ]),
            this.settingModel.findOne({ isGlobal: true }).lean().exec(),
        ]);
        const filterOptions = {
            states,
            categories,
            departureCities: departureCities.filter((city) => city),
        };
        const result = {
            filterOptions,
            featuredTours,
            toursByState,
            latestBlogs,
            settings,
        };
        await this.cacheManager.set(cacheKey, result, 300 * 1000);
        return result;
    }
    async getFeaturedTours() {
        const cacheKey = 'home_featured_tours';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const tours = await this.tourModel
            .find({ isFeatured: true, isActive: true })
            .limit(6)
            .exec();
        await this.cacheManager.set(cacheKey, tours, 600 * 1000);
        return tours;
    }
    async getUpcomingDepartures() {
        const cacheKey = 'home_upcoming_departures';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const today = date_util_1.DateUtil.startOfDayIST(date_util_1.DateUtil.nowIST().toDate());
        const thirtyDaysLater = date_util_1.DateUtil.nowIST()
            .add(15, 'day')
            .endOf('day')
            .utc()
            .toDate();
        const dates = await this.tourDateModel
            .find({
            startDate: { $gte: today, $lte: thirtyDaysLater },
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
        })
            .populate('tour')
            .sort({ startDate: 1 })
            .limit(10)
            .exec();
        await this.cacheManager.set(cacheKey, dates, 300 * 1000);
        return dates;
    }
    async getActiveOffers() {
        const cacheKey = 'home_active_offers';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const offers = await this.couponModel
            .find({
            isActive: true,
            expiryDate: { $gt: date_util_1.DateUtil.startOfDayIST(date_util_1.DateUtil.nowIST().toDate()) },
        })
            .limit(5)
            .exec();
        await this.cacheManager.set(cacheKey, offers, 1800 * 1000);
        return offers;
    }
    async getLatestBlogs() {
        const blogs = await this.blogModel.aggregate([
            { $match: { isPublished: true } },
            { $sample: { size: 5 } },
        ]);
        return blogs;
    }
    async getToursByState() {
        const cacheKey = 'home_tours_by_state';
        const stats = await this.tourModel.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$state',
                    tourCount: { $sum: 1 },
                    sampleTours: { $push: '$$ROOT' },
                },
            },
            {
                $project: {
                    state: '$_id',
                    tourCount: 1,
                    sampleTours: { $slice: ['$sampleTours', 3] },
                    _id: 0,
                },
            },
            { $sort: { tourCount: -1 } },
        ]);
        await this.cacheManager.set(cacheKey, stats, 600 * 1000);
        return stats;
    }
    async getToursByStateName(state, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [tours, total] = await Promise.all([
            this.tourModel
                .find({ state: new RegExp(state, 'i'), isActive: true })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.tourModel.countDocuments({
                state: new RegExp(state, 'i'),
                isActive: true,
            }),
        ]);
        return {
            tours,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        };
    }
    async getRecentlyViewedTours(userId) {
        return this.tourModel
            .find({ isActive: true })
            .sort({ viewCount: -1 })
            .limit(5)
            .exec();
    }
};
exports.HomeService = HomeService;
exports.HomeService = HomeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tour_schema_1.Tour.name)),
    __param(1, (0, mongoose_1.InjectModel)(tour_date_schema_1.TourDate.name)),
    __param(2, (0, mongoose_1.InjectModel)(blog_schema_1.Blog.name)),
    __param(3, (0, mongoose_1.InjectModel)(coupon_schema_1.Coupon.name)),
    __param(4, (0, mongoose_1.InjectModel)(setting_schema_1.Setting.name)),
    __param(5, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model, Object])
], HomeService);
//# sourceMappingURL=home.service.js.map