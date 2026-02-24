import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour, TourDocument } from '../../database/schemas/tour.schema';
import { TourDate, TourDateDocument } from '../../database/schemas/tour-date.schema';
import { Review, ReviewDocument } from '../../database/schemas/review.schema';
import { CreateTourDto, UpdateTourDto } from './dto/create-tour.dto';
import { TourFiltersDto } from './dto/tour-filters.dto';
import { paginate, PaginationResult } from '../../common/helpers/pagination.helper';
import { generateUniqueSlug } from '../../common/helpers/slug.helper';

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

        if (location) query.location = new RegExp(location, 'i');

        if (state)
        {
            if (Array.isArray(state))
            {
                query.state = { $in: state.map(s => new RegExp(s, 'i')) };
            } else
            {
                query.state = new RegExp(state, 'i');
            }
        }

        if (category)
        {
            if (Array.isArray(category))
            {
                query.category = { $in: category };
            } else
            {
                query.category = category;
            }
        }

        if (priceMin || priceMax)
        {
            query.basePrice = {};
            if (priceMin) query.basePrice.$gte = priceMin;
            if (priceMax) query.basePrice.$lte = priceMax;
        }

        if (durationDays || minDuration || maxDuration)
        {
            query['departureOptions.totalDays'] = {};
            if (durationDays) query['departureOptions.totalDays'].$eq = durationDays;
            if (minDuration) query['departureOptions.totalDays'].$gte = minDuration;
            if (maxDuration) query['departureOptions.totalDays'].$lte = maxDuration;

            // Clean up if it's just an empty object or has only one prop
            if (Object.keys(query['departureOptions.totalDays']).length === 0)
            {
                delete query['departureOptions.totalDays'];
            }
        }

        if (departureCity)
        {
            query['departureOptions.fromCity'] = new RegExp(departureCity, 'i');
        }

        if (search)
        {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { state: new RegExp(search, 'i') },
            ];
        }

        return paginate(this.tourModel, query, pagination);
    }

    async getTourBySlug(slug: string): Promise<TourDocument> {
        const tour = await this.tourModel
            .findOneAndUpdate(
                { slug, isActive: true },
                { $inc: { viewCount: 1 } },
                { returnDocument: 'after' },
            )
            .exec();

        if (!tour)
        {
            throw new NotFoundException('Tour not found');
        }

        return tour;
    }

    async getTourDates(tourId: string): Promise<TourDateDocument[]> {
        return this.tourDateModel
            .find({
                tour: tourId as any,
                status: 'upcoming',
                startDate: { $gte: new Date() },
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

    async adminCreateTour(createTourDto: CreateTourDto, uploadedImages: string[] = [], thumbnailUrl?: string): Promise<TourDocument> {
        this.logger.log(`Admin creating tour: ${createTourDto.title}`);
        const slug = await generateUniqueSlug(this.tourModel, createTourDto.title);
        // Uploaded file paths take precedence over any URLs in the DTO
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

    async adminUpdateTour(id: string, updateTourDto: UpdateTourDto, uploadedImages: string[] = [], thumbnailUrl?: string): Promise<TourDocument> {
        this.logger.log(`Admin updating tour ${id}`);
        const updatePayload: any = { $set: { ...updateTourDto } };

        if (thumbnailUrl) updatePayload.$set.thumbnailImage = thumbnailUrl;

        // Push new uploaded images into the existing images array
        if (uploadedImages.length > 0)
        {
            updatePayload.$push = { images: { $each: uploadedImages } };
        }

        const tour = await this.tourModel.findByIdAndUpdate(
            id,
            updatePayload,
            { returnDocument: 'after', runValidators: true },
        );

        if (!tour)
        {
            this.logger.warn(`Tour update failed: Tour ${id} not found`);
            throw new NotFoundException('Tour not found');
        }

        this.logger.log(`Tour updated successfully: ${tour.slug}`);
        return tour;
    }

    async adminSoftDelete(id: string): Promise<void> {
        this.logger.log(`Admin soft-deleting tour: ${id}`);
        const result = await this.tourModel.findByIdAndUpdate(id, { isActive: false });
        if (!result)
        {
            this.logger.warn(`Tour deletion failed: Tour ${id} not found`);
            throw new NotFoundException('Tour not found');
        }
        this.logger.log(`Tour ${id} soft-deleted successfully.`);
    }

    async toggleStatus(id: string): Promise<TourDocument> {
        this.logger.log(`Toggling status for tour: ${id}`);
        const tour = await this.tourModel.findById(id);
        if (!tour)
        {
            this.logger.warn(`Toggle status failed: Tour ${id} not found`);
            throw new NotFoundException('Tour not found');
        }
        tour.isActive = !tour.isActive;
        const savedTour = await tour.save();
        this.logger.log(`Tour ${id} status toggled to: ${savedTour.isActive}`);
        return savedTour;
    }

    async toggleFeatured(id: string): Promise<TourDocument> {
        this.logger.log(`Toggling featured for tour: ${id}`);
        const tour = await this.tourModel.findById(id);
        if (!tour)
        {
            this.logger.warn(`Toggle featured failed: Tour ${id} not found`);
            throw new NotFoundException('Tour not found');
        }
        tour.isFeatured = !tour.isFeatured;
        const savedTour = await tour.save();
        this.logger.log(`Tour ${id} featured toggled to: ${savedTour.isFeatured}`);
        return savedTour;
    }

    async adminGetTours(pagination: any) {
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
