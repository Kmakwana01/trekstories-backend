import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../../database/schemas/review.schema';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { Tour, TourDocument } from '../../database/schemas/tour.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { FilterReviewDto } from './dto/filter-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(Tour.name) private tourModel: Model<TourDocument>,
    ) { }

    async create(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
        const { bookingId, rating, comment } = createReviewDto;

        // 1. Verify booking exists and belongs to user
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking)
        {
            throw new NotFoundException('Booking not found');
        }

        if (booking.user.toString() !== userId)
        {
            throw new BadRequestException('You can only review your own bookings');
        }

        // 2. Verify booking status is completed
        if (booking.status !== 'completed' && booking.status !== 'confirmed')
        {
            throw new BadRequestException('You can only review completed (or confirmed) bookings');
        }

        // 3. Check for existing review
        const existing = await this.reviewModel.findOne({ booking: bookingId } as any);
        if (existing)
        {
            throw new ConflictException('You have already reviewed this booking');
        }

        // 4. Create review
        const review = new this.reviewModel({
            user: userId,
            tour: booking.tour,
            booking: bookingId,
            rating,
            comment,
            status: 'pending',
        });

        return review.save();
    }

    async findAllByTour(tourId: string, page: number = 1, limit: number = 10) {
        const p = Math.max(1, Number(page) || 1);
        const l = Math.max(1, Number(limit) || 10);
        const skip = (p - 1) * l;

        const query = { tour: tourId, status: 'approved' };

        const reviews = await this.reviewModel
            .find(query as any)
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(l)
            .exec();

        const total = await this.reviewModel.countDocuments(query as any);

        return {
            data: reviews,
            total,
            page: p,
            limit: l,
            totalPages: Math.ceil(total / l),
        };
    }

    async findAllByUser(userId: string) {
        const results = await this.reviewModel
            .find({ user: userId } as any)
            .populate('tour', 'title featuredImage')
            .sort({ createdAt: -1 })
            .exec();
        return results;
    }

    async findAllAdmin(filters: FilterReviewDto) {
        const { tourId, status, page = 1, limit = 10 } = filters;
        const p = Math.max(1, Number(page) || 1);
        const l = Math.max(1, Number(limit) || 10);
        const skip = (p - 1) * l;

        const query: any = {};
        if (tourId) query.tour = tourId;
        if (status) query.status = status;

        const reviews = await this.reviewModel
            .find(query)
            .populate('user', 'name email')
            .populate('tour', 'title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(l)
            .exec();

        const total = await this.reviewModel.countDocuments(query);

        return {
            data: reviews,
            total,
            page: p,
            limit: l,
            totalPages: Math.ceil(total / l),
        };
    }

    async approve(id: string): Promise<Review> {
        const review = await this.reviewModel.findById(id);
        if (!review) throw new NotFoundException('Review not found');

        review.status = 'approved';
        await review.save();

        await this.updateTourRating(review.tour.toString());

        return review;
    }

    async reject(id: string, reason: string): Promise<Review> {
        const review = await this.reviewModel.findByIdAndUpdate(
            id,
            { status: 'rejected', adminNote: reason },
            { returnDocument: 'after', returnDocument: 'after' } as any, // Fix deprecation warning
        );
        if (!review) throw new NotFoundException('Review not found');
        return review;
    }

    async delete(id: string): Promise<void> {
        const review = await this.reviewModel.findById(id);
        if (!review) throw new NotFoundException('Review not found');

        const tourId = review.tour.toString();
        const wasApproved = review.status === 'approved';

        await this.reviewModel.deleteOne({ _id: id });

        if (wasApproved)
        {
            await this.updateTourRating(tourId);
        }
    }

    private async updateTourRating(tourId: string) {
        const tourObjectId = new Types.ObjectId(tourId);
        const stats = await this.reviewModel.aggregate([
            { $match: { tour: tourObjectId, status: 'approved' } },
            {
                $group: {
                    _id: '$tour',
                    avgRating: { $avg: '$rating' },
                    nRating: { $sum: 1 },
                },
            },
        ]);

        if (stats.length > 0)
        {
            await this.tourModel.findByIdAndUpdate(tourId, {
                averageRating: stats[0].avgRating,
                reviewCount: stats[0].nRating,
            });
        } else
        {
            await this.tourModel.findByIdAndUpdate(tourId, {
                averageRating: 0,
                reviewCount: 0,
            });
        }
    }
}
