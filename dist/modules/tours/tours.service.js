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
var ToursService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToursService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tour_schema_1 = require("../../database/schemas/tour.schema");
const tour_date_schema_1 = require("../../database/schemas/tour-date.schema");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
const slug_helper_1 = require("../../common/helpers/slug.helper");
const date_util_1 = require("../../utils/date.util");
const tour_date_status_enum_1 = require("../../common/enums/tour-date-status.enum");
let ToursService = ToursService_1 = class ToursService {
    tourModel;
    tourDateModel;
    reviewModel;
    logger = new common_1.Logger(ToursService_1.name);
    constructor(tourModel, tourDateModel, reviewModel) {
        this.tourModel = tourModel;
        this.tourDateModel = tourDateModel;
        this.reviewModel = reviewModel;
    }
    async getAllTours(filters) {
        const { location, state, category, priceMin, priceMax, durationDays, minDuration, maxDuration, departureCity, search, ...pagination } = filters;
        const query = { isActive: true };
        this.logger.debug(`Filters received: ${JSON.stringify(filters)}`);
        if (location)
            query.location = new RegExp(location, 'i');
        if (state) {
            const stateArray = typeof state === 'string' ? state.split(',') : state;
            if (Array.isArray(stateArray) && stateArray.length > 0) {
                query.state = { $in: stateArray.map(s => new RegExp(s.trim(), 'i')) };
            }
            else if (typeof state === 'string' && state.trim()) {
                query.state = new RegExp(state.trim(), 'i');
            }
        }
        if (category) {
            const catArray = typeof category === 'string' ? category.split(',') : category;
            if (Array.isArray(catArray) && catArray.length > 0) {
                query.category = { $in: catArray.map(c => c.trim().toUpperCase()) };
            }
            else if (typeof category === 'string' && category.trim()) {
                query.category = category.trim().toUpperCase();
            }
        }
        if (priceMin || priceMax) {
            query.basePrice = {};
            if (priceMin !== undefined && priceMin !== null)
                query.basePrice.$gte = priceMin;
            if (priceMax !== undefined && priceMax !== null)
                query.basePrice.$lte = priceMax;
            if (Object.keys(query.basePrice).length === 0)
                delete query.basePrice;
        }
        if (durationDays || minDuration || maxDuration) {
            const durationQuery = {};
            if (durationDays)
                durationQuery.$eq = durationDays;
            if (minDuration)
                durationQuery.$gte = minDuration;
            if (maxDuration)
                durationQuery.$lte = maxDuration;
            if (Object.keys(durationQuery).length > 0) {
                query['departureOptions.totalDays'] = durationQuery;
            }
        }
        if (departureCity) {
            const cityArray = typeof departureCity === 'string' ? departureCity.split(',') : departureCity;
            if (Array.isArray(cityArray) && cityArray.length > 0) {
                query['departureOptions.fromCity'] = { $in: cityArray.map(c => new RegExp(c.trim(), 'i')) };
            }
            else if (typeof departureCity === 'string' && departureCity.trim()) {
                query['departureOptions.fromCity'] = new RegExp(departureCity.trim(), 'i');
            }
        }
        if (search) {
            query.$or = [
                { title: new RegExp(search.trim(), 'i') },
                { description: new RegExp(search.trim(), 'i') },
                { state: new RegExp(search.trim(), 'i') },
            ];
        }
        this.logger.log(`Tours query generated: ${JSON.stringify(query)}`);
        return (0, pagination_helper_1.paginate)(this.tourModel, query, pagination);
    }
    async getTourBySlug(slug) {
        const tour = await this.tourModel
            .findOneAndUpdate({ slug, isActive: true }, { $inc: { viewCount: 1 } }, { returnDocument: 'after' })
            .lean()
            .exec();
        if (!tour) {
            throw new common_1.NotFoundException('Tour not found');
        }
        const dates = await this.tourDateModel
            .find({
            tour: tour._id,
            status: { $in: [tour_date_status_enum_1.TourDateStatus.UPCOMING, tour_date_status_enum_1.TourDateStatus.FULL] },
            startDate: { $gte: date_util_1.DateUtil.startOfDayIST(date_util_1.DateUtil.nowIST().toDate()) },
        })
            .sort({ startDate: 1 })
            .lean()
            .exec();
        const availableDates = dates.map(d => ({
            ...d,
            availableSeats: d.totalSeats - d.bookedSeats
        }));
        return { ...tour, availableDates };
    }
    async getTourDates(tourId) {
        return this.tourDateModel
            .find({
            tour: tourId,
            status: { $in: [tour_date_status_enum_1.TourDateStatus.UPCOMING, tour_date_status_enum_1.TourDateStatus.FULL] },
            startDate: { $gte: date_util_1.DateUtil.startOfDayIST(date_util_1.DateUtil.nowIST().toDate()) },
        })
            .sort({ startDate: 1 })
            .exec();
    }
    async getFilterOptions() {
        const [states, categories, departureCities] = await Promise.all([
            this.tourModel.distinct('state', { isActive: true }),
            this.tourModel.distinct('category', { isActive: true }),
            this.tourModel.distinct('departureOptions.fromCity', { isActive: true }),
        ]);
        return {
            states,
            categories,
            departureCities: departureCities.filter(city => city),
        };
    }
    async getByState(state, pagination) {
        const query = { state: new RegExp(state, 'i'), isActive: true };
        return (0, pagination_helper_1.paginate)(this.tourModel, query, pagination);
    }
    async adminCreateTour(createTourDto, uploadedImages = [], thumbnailUrl) {
        this.logger.log(`Admin creating tour: ${createTourDto.title}`);
        const slug = await (0, slug_helper_1.generateUniqueSlug)(this.tourModel, createTourDto.title);
        const images = uploadedImages.length > 0 ? uploadedImages : (createTourDto.images || []);
        const thumbnailImage = thumbnailUrl || createTourDto.thumbnailImage;
        const tour = new this.tourModel({
            ...createTourDto,
            slug,
            images,
            thumbnailImage,
        });
        const savedTour = await tour.save();
        this.logger.log(`Tour created successfully: ${savedTour.slug} (${savedTour._id})`);
        return savedTour;
    }
    async adminUpdateTour(id, updateTourDto, uploadedImages = [], thumbnailUrl) {
        this.logger.log(`Admin updating tour ${id}`);
        const tour = await this.tourModel.findById(id).exec();
        if (!tour) {
            this.logger.warn(`Tour update failed: Tour ${id} not found`);
            throw new common_1.NotFoundException('Tour not found');
        }
        const { images: dtoImages, ...restDto } = updateTourDto;
        this.logger.debug(`Transformed restDto Keys: ${Object.keys(restDto).join(', ')}`);
        if (restDto.itinerary)
            this.logger.debug(`Itinerary present with ${restDto.itinerary.length} days`);
        if (restDto.faqs)
            this.logger.debug(`FAQs present with ${restDto.faqs.length} items`);
        Object.entries(restDto).forEach(([key, value]) => {
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    this.logger.debug(`Updating Array field: ${key}`);
                    const plainValue = JSON.parse(JSON.stringify(value));
                    tour.set(key, plainValue);
                }
                else {
                    this.logger.debug(`Updating Simple field: ${key}`);
                    tour.set(key, value);
                }
            }
        });
        if (thumbnailUrl) {
            tour.thumbnailImage = thumbnailUrl;
        }
        if (dtoImages !== undefined) {
            tour.images = dtoImages;
        }
        if (uploadedImages.length > 0) {
            tour.images = [...(tour.images || []), ...uploadedImages];
        }
        try {
            const updatedTour = await tour.save();
            this.logger.log(`Tour updated successfully: ${updatedTour.slug}`);
            return updatedTour;
        }
        catch (error) {
            this.logger.error(`Failed to update tour ${id}: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Failed to update tour: ' + error.message);
        }
    }
    async adminSoftDelete(id) {
        this.logger.log(`Admin permanently deleting tour: ${id}`);
        const result = await this.tourModel.findByIdAndDelete(id);
        if (!result) {
            this.logger.warn(`Tour deletion failed: Tour ${id} not found`);
            throw new common_1.NotFoundException('Tour not found');
        }
        this.logger.log(`Tour ${id} permanently deleted.`);
    }
    async toggleStatus(id) {
        this.logger.log(`Toggling status for tour: ${id}`);
        const tour = await this.tourModel.findById(id).select('isActive').exec();
        if (!tour) {
            this.logger.warn(`Toggle status failed: Tour ${id} not found`);
            throw new common_1.NotFoundException('Tour not found');
        }
        const updatedTour = await this.tourModel.findByIdAndUpdate(id, { $set: { isActive: !tour.isActive } }, { new: true, runValidators: false }).exec();
        this.logger.log(`Tour ${id} status toggled to: ${updatedTour?.isActive}`);
        return updatedTour;
    }
    async toggleFeatured(id) {
        this.logger.log(`Toggling featured for tour: ${id}`);
        const tour = await this.tourModel.findById(id).select('isFeatured').exec();
        if (!tour) {
            this.logger.warn(`Toggle featured failed: Tour ${id} not found`);
            throw new common_1.NotFoundException('Tour not found');
        }
        const updatedTour = await this.tourModel.findByIdAndUpdate(id, { $set: { isFeatured: !tour.isFeatured } }, { new: true, runValidators: false }).exec();
        this.logger.log(`Tour ${id} featured toggled to: ${updatedTour?.isFeatured}`);
        return updatedTour;
    }
    async adminGetTours(pagination) {
        return (0, pagination_helper_1.paginate)(this.tourModel, {}, pagination);
    }
    async adminGetTourById(id) {
        const tour = await this.tourModel.findById(id);
        if (!tour) {
            throw new common_1.NotFoundException('Tour not found');
        }
        return tour;
    }
    async addImage(id, imageUrl) {
        return this.tourModel.findByIdAndUpdate(id, { $push: { images: imageUrl } }, { returnDocument: 'after' });
    }
    async removeImage(id, imageUrl) {
        return this.tourModel.findByIdAndUpdate(id, { $pull: { images: imageUrl } }, { returnDocument: 'after' });
    }
};
exports.ToursService = ToursService;
exports.ToursService = ToursService = ToursService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tour_schema_1.Tour.name)),
    __param(1, (0, mongoose_1.InjectModel)(tour_date_schema_1.TourDate.name)),
    __param(2, (0, mongoose_1.InjectModel)('Review')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ToursService);
//# sourceMappingURL=tours.service.js.map