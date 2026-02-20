import { Injectable, NotFoundException } from '@nestjs/common';
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
            departureCity,
            search,
            ...pagination
        } = filters;

        const query: any = { isActive: true };

        if (location) query.location = new RegExp(location, 'i');
        if (state) query.state = new RegExp(state, 'i');
        if (category) query.category = category;

        if (priceMin || priceMax)
        {
            query.basePrice = {};
            if (priceMin) query.basePrice.$gte = priceMin;
            if (priceMax) query.basePrice.$lte = priceMax;
        }

        if (durationDays)
        {
            query['departureOptions.totalDays'] = durationDays;
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
                { new: true },
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

    async adminCreateTour(createTourDto: CreateTourDto): Promise<TourDocument> {
        const slug = await generateUniqueSlug(this.tourModel, createTourDto.title);
        const tour = new this.tourModel({
            ...createTourDto,
            slug,
        });
        return tour.save();
    }

    async adminUpdateTour(id: string, updateTourDto: UpdateTourDto): Promise<TourDocument> {
        const tour = await this.tourModel.findByIdAndUpdate(
            id,
            { $set: updateTourDto },
            { new: true, runValidators: true },
        );

        if (!tour)
        {
            throw new NotFoundException('Tour not found');
        }

        return tour;
    }

    async adminSoftDelete(id: string): Promise<void> {
        const result = await this.tourModel.findByIdAndUpdate(id, { isActive: false });
        if (!result)
        {
            throw new NotFoundException('Tour not found');
        }
    }

    async toggleStatus(id: string): Promise<TourDocument> {
        const tour = await this.tourModel.findById(id);
        if (!tour)
        {
            throw new NotFoundException('Tour not found');
        }
        tour.isActive = !tour.isActive;
        return tour.save();
    }

    async toggleFeatured(id: string): Promise<TourDocument> {
        const tour = await this.tourModel.findById(id);
        if (!tour)
        {
            throw new NotFoundException('Tour not found');
        }
        tour.isFeatured = !tour.isFeatured;
        return tour.save();
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
            { new: true }
        );
    }

    async removeImage(id: string, imageUrl: string) {
        return this.tourModel.findByIdAndUpdate(
            id,
            { $pull: { images: imageUrl } },
            { new: true }
        );
    }
}
