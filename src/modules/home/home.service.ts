import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { DateUtil } from '../../utils/date.util';
import { Tour } from '../../database/schemas/tour.schema';
import type { TourDocument } from '../../database/schemas/tour.schema';
import { TourDate } from '../../database/schemas/tour-date.schema';
import type { TourDateDocument } from '../../database/schemas/tour-date.schema';
import { Blog } from '../../database/schemas/blog.schema';
import type { BlogDocument } from '../../database/schemas/blog.schema';
import { Coupon } from '../../database/schemas/coupon.schema';
import type { CouponDocument } from '../../database/schemas/coupon.schema';
import { Setting } from '../../database/schemas/setting.schema';
import type { SettingDocument } from '../../database/schemas/setting.schema';
import { TourDateStatus } from '../../common/enums/tour-date-status.enum';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    @InjectModel(TourDate.name) private tourDateModel: Model<TourDateDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getHomeData() {
    const cacheKey = 'home_data_payload';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    // Run independent queries in parallel
    const [
      states,
      categories,
      departureCities,
      featuredTours,
      toursByState,
      latestBlogs,
      settings,
    ] = await Promise.all([
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

    await this.cacheManager.set(cacheKey, result, 300 * 1000); // 5 min
    return result;
  }

  async getFeaturedTours() {
    const cacheKey = 'home_featured_tours';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const tours = await this.tourModel
      .find({ isFeatured: true, isActive: true })
      .limit(6)
      .exec();

    await this.cacheManager.set(cacheKey, tours, 600 * 1000); // 10 min
    return tours;
  }

  async getUpcomingDepartures() {
    const cacheKey = 'home_upcoming_departures';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const today = DateUtil.startOfDayIST(DateUtil.nowIST().toDate());
    const thirtyDaysLater = DateUtil.nowIST()
      .add(15, 'day')
      .endOf('day')
      .utc()
      .toDate();

    const dates = await this.tourDateModel
      .find({
        startDate: { $gte: today, $lte: thirtyDaysLater },
        status: TourDateStatus.UPCOMING,
      })
      .populate('tour')
      .sort({ startDate: 1 })
      .limit(10)
      .exec();

    await this.cacheManager.set(cacheKey, dates, 300 * 1000); // 5 min
    return dates;
  }

  async getActiveOffers() {
    const cacheKey = 'home_active_offers';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const offers = await this.couponModel
      .find({
        isActive: true,
        expiryDate: { $gt: DateUtil.startOfDayIST(DateUtil.nowIST().toDate()) },
      })
      .limit(5)
      .exec();

    await this.cacheManager.set(cacheKey, offers, 1800 * 1000); // 30 min
    return offers;
  }

  async getLatestBlogs() {
    // The user wants random blogs on the home page, so we will use an aggregation pipeline
    // with $sample instead of cache.
    const blogs = await this.blogModel.aggregate([
      { $match: { isPublished: true } },
      { $sample: { size: 5 } },
    ]);

    // Populate author manually if needed since aggregate doesn't do it automatically,
    // though the home page currently doesn't strictly require full author population to display (it checks typeof blog.author).
    // If needed, we could run populate, but $sample is fast.

    return blogs;
  }

  async getToursByState() {
    const cacheKey = 'home_tours_by_state';
    // const cached = await this.cacheManager.get(cacheKey);
    // if (cached) return cached;

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

    await this.cacheManager.set(cacheKey, stats, 600 * 1000); // 10 min
    return stats;
  }

  async getToursByStateName(state: string, page = 1, limit = 10) {
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

  async getRecentlyViewedTours(userId: string) {
    // For now, return most viewed tours as placeholder until we implement user-specific tracking
    // Personal tracking should not be cached globally
    return this.tourModel
      .find({ isActive: true })
      .sort({ viewCount: -1 })
      .limit(5)
      .exec();
  }
}
