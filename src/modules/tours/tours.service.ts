import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour, TourDocument } from '../../database/schemas/tour.schema';
import { TourDate, TourDateDocument } from '../../database/schemas/tour-date.schema';
import { Review, ReviewDocument } from '../../database/schemas/review.schema';
import { CreateTourDto, UpdateTourDto } from './dto/create-tour.dto';
import { TourFiltersDto } from './dto/tour-filters.dto';
import { paginate, PaginationResult } from '../../common/helpers/pagination.helper';
import { generateUniqueSlug } from '../../common/helpers/slug.helper';
import { DateUtil } from '../../utils/date.util';
import { TourDateStatus } from '../../common/enums/tour-date-status.enum';

@Injectable()
export class ToursService {
    private readonly logger = new Logger(ToursService.name);

    constructor(
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
        @InjectModel(TourDate.name) private tourDateModel: Model<TourDateDocument>,
        @InjectModel('Review') private reviewModel: Model<ReviewDocument>,
    ) { }

    // --- Public Methods ---

    async getAllTours(filters: TourFiltersDto): Promise<PaginationResult<TourDocument>> {
        const {
            location,
            state,
            category,
            priceMin,
            priceMax,
            durationDays,
            minDuration,
            maxDuration,
            departureCity,
            search,
            ...pagination
        } = filters;

        const query: any = { isActive: true };
        this.logger.debug(`Filters received: ${JSON.stringify(filters)}`);

        if (location) query.location = new RegExp(location, 'i');

        if (state)
        {
            const stateArray = typeof state === 'string' ? state.split(',') : state;
            if (Array.isArray(stateArray) && stateArray.length > 0)
            {
                query.state = { $in: stateArray.map(s => new RegExp(s.trim(), 'i')) };
            } else if (typeof state === 'string' && state.trim())
            {
                query.state = new RegExp(state.trim(), 'i');
            }
        }

        if (category)
        {
            const catArray = typeof category === 'string' ? category.split(',') : category;
            if (Array.isArray(catArray) && catArray.length > 0)
            {
                query.category = { $in: catArray.map(c => c.trim().toUpperCase()) };
            } else if (typeof category === 'string' && category.trim())
            {
                query.category = category.trim().toUpperCase();
            }
        }

        if (priceMin || priceMax)
        {
            query.basePrice = {};
            if (priceMin !== undefined && priceMin !== null) query.basePrice.$gte = priceMin;
            if (priceMax !== undefined && priceMax !== null) query.basePrice.$lte = priceMax;

            if (Object.keys(query.basePrice).length === 0) delete query.basePrice;
        }

        if (durationDays || minDuration || maxDuration)
        {
            const durationQuery: any = {};
            if (durationDays) durationQuery.$eq = durationDays;
            if (minDuration) durationQuery.$gte = minDuration;
            if (maxDuration) durationQuery.$lte = maxDuration;

            if (Object.keys(durationQuery).length > 0)
            {
                query['departureOptions.totalDays'] = durationQuery;
            }
        }

        if (departureCity)
        {
            const cityArray = typeof departureCity === 'string' ? departureCity.split(',') : departureCity;
            if (Array.isArray(cityArray) && cityArray.length > 0)
            {
                query['departureOptions.fromCity'] = { $in: cityArray.map(c => new RegExp(c.trim(), 'i')) };
            } else if (typeof departureCity === 'string' && departureCity.trim())
            {
                query['departureOptions.fromCity'] = new RegExp(departureCity.trim(), 'i');
            }
        }

        if (search)
        {
            query.$or = [
                { title: new RegExp(search.trim(), 'i') },
                { description: new RegExp(search.trim(), 'i') },
                { state: new RegExp(search.trim(), 'i') },
            ];
        }

        this.logger.log(`Tours query generated: ${JSON.stringify(query)}`);
        return paginate(this.tourModel, query, pagination);
    }

    async getTourBySlug(slug: string): Promise<any> {
        const tour = await this.tourModel
            .findOneAndUpdate(
                { slug, isActive: true },
                { $inc: { viewCount: 1 } },
                { returnDocument: 'after' },
            )
            .lean()
            .exec();

        if (!tour)
        {
            throw new NotFoundException('Tour not found');
        }

        const dates = await this.tourDateModel
            .find({
                tour: (tour as any)._id,
                status: { $in: [TourDateStatus.UPCOMING, TourDateStatus.FULL] },
                startDate: { $gte: DateUtil.startOfDayIST(DateUtil.nowIST().toDate()) },
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

    async getTourDates(tourId: string): Promise<TourDateDocument[]> {
        return this.tourDateModel
            .find({
                tour: tourId as any,
                status: { $in: [TourDateStatus.UPCOMING, TourDateStatus.FULL] },
                startDate: { $gte: DateUtil.startOfDayIST(DateUtil.nowIST().toDate()) },
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

    async getByState(state: string, pagination: any) {
        const query = { state: new RegExp(state, 'i'), isActive: true };
        return paginate(this.tourModel, query, pagination);
    }

    // --- Admin Methods ---

    async adminCreateTour(createTourDto: CreateTourDto, uploadedImages: string[] = [], thumbnailUrl?: string, brochureUrl?: string): Promise<TourDocument> {
        this.logger.log(`Admin creating tour: ${createTourDto.title}`);
        const slug = await generateUniqueSlug(this.tourModel, createTourDto.title);
        // Uploaded file paths take precedence over any URLs in the DTO
        const images = uploadedImages.length > 0 ? uploadedImages : (createTourDto.images || []);
        const thumbnailImage = thumbnailUrl || createTourDto.thumbnailImage;
        const brochure = brochureUrl || createTourDto.brochureUrl;
        const tour = new this.tourModel({
            ...createTourDto,
            slug,
            images,
            thumbnailImage,
            brochureUrl: brochure,
        });
        const savedTour = await tour.save();
        this.logger.log(`Tour created successfully: ${savedTour.slug} (${savedTour._id})`);
        return savedTour;
    }

    async adminUpdateTour(id: string, updateTourDto: UpdateTourDto, uploadedImages: string[] = [], thumbnailUrl?: string, brochureUrl?: string): Promise<TourDocument> {
        this.logger.log(`Admin updating tour ${id}`);

        const tour = await this.tourModel.findById(id).exec();
        if (!tour)
        {
            this.logger.warn(`Tour update failed: Tour ${id} not found`);
            throw new NotFoundException('Tour not found');
        }

        const { images: dtoImages, ...restDto } = updateTourDto;

        this.logger.debug(`Transformed restDto Keys: ${Object.keys(restDto).join(', ')}`);
        if (restDto.itinerary) this.logger.debug(`Itinerary present with ${restDto.itinerary.length} days`);
        if (restDto.faqs) this.logger.debug(`FAQs present with ${restDto.faqs.length} items`);

        // Manually update fields to ensure Mongoose picks up changes in nested arrays
        Object.entries(restDto).forEach(([key, value]) => {
            if (value !== undefined)
            {
                if (Array.isArray(value))
                {
                    this.logger.debug(`Updating Array field: ${key}`);
                    // Ensure plain objects for Mongoose to avoid class-transformer / Mongoose serialization issues
                    const plainValue = JSON.parse(JSON.stringify(value));
                    tour.set(key, plainValue);
                } else
                {
                    this.logger.debug(`Updating Simple field: ${key}`);
                    tour.set(key, value);
                }
            }
        });

        if (thumbnailUrl)
        {
            tour.thumbnailImage = thumbnailUrl;
        }

        if (brochureUrl)
        {
            tour.brochureUrl = brochureUrl;
        }

        // Handle Images
        if (dtoImages !== undefined)
        {
            tour.images = dtoImages;
        }

        if (uploadedImages.length > 0)
        {
            tour.images = [...(tour.images || []), ...uploadedImages];
        }

        try
        {
            const updatedTour = await tour.save();
            this.logger.log(`Tour updated successfully: ${updatedTour.slug}`);
            return updatedTour;
        } catch (error)
        {
            this.logger.error(`Failed to update tour ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to update tour: ' + error.message);
        }
    }

    async adminSoftDelete(id: string): Promise<void> {
        this.logger.log(`Admin permanently deleting tour: ${id}`);
        const result = await this.tourModel.findByIdAndDelete(id);
        if (!result)
        {
            this.logger.warn(`Tour deletion failed: Tour ${id} not found`);
            throw new NotFoundException('Tour not found');
        }
        this.logger.log(`Tour ${id} permanently deleted.`);
    }

    async toggleStatus(id: string): Promise<TourDocument> {
        this.logger.log(`Toggling status for tour: ${id}`);
        const tour = await this.tourModel.findById(id).select('isActive').exec();
        if (!tour)
        {
            this.logger.warn(`Toggle status failed: Tour ${id} not found`);
            throw new NotFoundException('Tour not found');
        }

        // Update only the isActive field bypassing full schema validation
        const updatedTour = await this.tourModel.findByIdAndUpdate(
            id,
            { $set: { isActive: !tour.isActive } },
            { returnDocument: 'after', runValidators: false }
        ).exec();

        this.logger.log(`Tour ${id} status toggled to: ${updatedTour?.isActive}`);
        return updatedTour as TourDocument;
    }

    async toggleFeatured(id: string): Promise<TourDocument> {
        this.logger.log(`Toggling featured for tour: ${id}`);
        // First get the tour to know its current state
        const tour = await this.tourModel.findById(id).select('isFeatured').exec();

        if (!tour)
        {
            this.logger.warn(`Toggle featured failed: Tour ${id} not found`);
            throw new NotFoundException('Tour not found');
        }

        // Update only the isFeatured field bypassing full schema validation
        const updatedTour = await this.tourModel.findByIdAndUpdate(
            id,
            { $set: { isFeatured: !tour.isFeatured } },
            { returnDocument: 'after', runValidators: false }
        ).exec();

        this.logger.log(`Tour ${id} featured toggled to: ${updatedTour?.isFeatured}`);
        return updatedTour as TourDocument;
    }

    async adminGetTours(pagination: any) {
        if (!pagination.order) pagination.order = 'desc';
        return paginate(this.tourModel, {}, pagination);
    }

    async adminGetTourById(id: string) {
        const tour = await this.tourModel.findById(id);
        if (!tour)
        {
            throw new NotFoundException('Tour not found');
        }
        return tour;
    }

    async addImage(id: string, imageUrl: string) {
        return this.tourModel.findByIdAndUpdate(
            id,
            { $push: { images: imageUrl } },
            { returnDocument: 'after' }
        );
    }

    async removeImage(id: string, imageUrl: string) {
        return this.tourModel.findByIdAndUpdate(
            id,
            { $pull: { images: imageUrl } },
            { returnDocument: 'after' }
        );
    }
}
