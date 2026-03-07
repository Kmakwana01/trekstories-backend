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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("../../database/schemas/review.schema");
const booking_schema_1 = require("../../database/schemas/booking.schema");
const tour_schema_1 = require("../../database/schemas/tour.schema");
const review_status_enum_1 = require("../../common/enums/review-status.enum");
const booking_status_enum_1 = require("../../common/enums/booking-status.enum");
let ReviewsService = class ReviewsService {
    reviewModel;
    bookingModel;
    tourModel;
    constructor(reviewModel, bookingModel, tourModel) {
        this.reviewModel = reviewModel;
        this.bookingModel = bookingModel;
        this.tourModel = tourModel;
    }
    async create(userId, createReviewDto) {
        const { bookingId, rating, comment } = createReviewDto;
        const booking = await this.bookingModel.findById(bookingId);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.user.toString() !== userId) {
            throw new common_1.BadRequestException('You can only review your own bookings');
        }
        if (booking.status !== booking_status_enum_1.BookingStatus.COMPLETED && booking.status !== booking_status_enum_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('You can only review completed (or confirmed) bookings');
        }
        const existing = await this.reviewModel.findOne({ booking: bookingId });
        if (existing) {
            throw new common_1.ConflictException('You have already reviewed this booking');
        }
        const review = new this.reviewModel({
            user: userId,
            tour: booking.tour,
            booking: bookingId,
            rating,
            comment,
            status: review_status_enum_1.ReviewStatus.PENDING,
        });
        return review.save();
    }
    async findAllByTour(tourId, page = 1, limit = 10) {
        const p = Math.max(1, Number(page) || 1);
        const l = Math.max(1, Number(limit) || 10);
        const skip = (p - 1) * l;
        const query = { tour: tourId, status: review_status_enum_1.ReviewStatus.APPROVED };
        const reviews = await this.reviewModel
            .find(query)
            .populate('user', 'name')
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
    async findAllByUser(userId) {
        const results = await this.reviewModel
            .find({ user: userId })
            .populate('tour', 'title thumbnailImage slug')
            .sort({ createdAt: -1 })
            .exec();
        return results;
    }
    async findAllAdmin(filters) {
        const { tourId, status, page = 1, limit = 10 } = filters;
        const p = Math.max(1, Number(page) || 1);
        const l = Math.max(1, Number(limit) || 10);
        const skip = (p - 1) * l;
        const query = {};
        if (tourId)
            query.tour = tourId;
        if (status)
            query.status = status;
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
    async approve(id) {
        const review = await this.reviewModel.findById(id);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        review.status = review_status_enum_1.ReviewStatus.APPROVED;
        await review.save();
        await this.updateTourRating(review.tour.toString());
        return review;
    }
    async reject(id, reason) {
        const review = await this.reviewModel.findByIdAndUpdate(id, { status: review_status_enum_1.ReviewStatus.REJECTED, adminNote: reason }, { returnDocument: 'after' });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return review;
    }
    async delete(id) {
        const review = await this.reviewModel.findById(id);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const tourId = review.tour.toString();
        const wasApproved = review.status === review_status_enum_1.ReviewStatus.APPROVED;
        await this.reviewModel.deleteOne({ _id: id });
        if (wasApproved) {
            await this.updateTourRating(tourId);
        }
    }
    async updateTourRating(tourId) {
        const tourObjectId = new mongoose_2.Types.ObjectId(tourId);
        const stats = await this.reviewModel.aggregate([
            { $match: { tour: tourObjectId, status: review_status_enum_1.ReviewStatus.APPROVED } },
            {
                $group: {
                    _id: '$tour',
                    avgRating: { $avg: '$rating' },
                    nRating: { $sum: 1 },
                },
            },
        ]);
        if (stats.length > 0) {
            await this.tourModel.findByIdAndUpdate(tourId, {
                averageRating: stats[0].avgRating,
                reviewCount: stats[0].nRating,
            });
        }
        else {
            await this.tourModel.findByIdAndUpdate(tourId, {
                averageRating: 0,
                reviewCount: 0,
            });
        }
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(tour_schema_1.Tour.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map