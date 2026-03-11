import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { Review } from '../../database/schemas/review.schema';
import { Booking } from '../../database/schemas/booking.schema';
import { Tour } from '../../database/schemas/tour.schema';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Types } from 'mongoose';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewModel: any;
  let bookingModel: any;
  let tourModel: any;

  const mockReview = {
    _id: 'review123',
    user: 'user123',
    tour: new Types.ObjectId().toString(),
    booking: 'booking123',
    rating: 5,
    comment: 'Great!',
    status: 'pending',
    save: jest.fn().mockResolvedValue(this),
  };

  const mockBooking = {
    _id: 'booking123',
    user: 'user123',
    tour: 'tour123',
    status: 'completed',
  };

  const mockReviewModel = {
    new: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...dto, _id: 'review123' }),
    })),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  };

  function MockReviewModel(dto: any) {
    this.data = dto;
    this.save = jest.fn().mockResolvedValue({ ...dto, _id: 'review123' });
  }
  Object.assign(MockReviewModel, mockReviewModel);

  const mockBookingModel = {
    findById: jest.fn(),
  };

  const mockTourModel = {
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getModelToken(Review.name),
          useValue: MockReviewModel,
        },
        {
          provide: getModelToken(Booking.name),
          useValue: mockBookingModel,
        },
        {
          provide: getModelToken(Tour.name),
          useValue: mockTourModel,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewModel = module.get(getModelToken(Review.name));
    bookingModel = module.get(getModelToken(Booking.name));
    tourModel = module.get(getModelToken(Tour.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a review', async () => {
      bookingModel.findById.mockResolvedValue(mockBooking);
      reviewModel.findOne.mockResolvedValue(null);

      const dto = { bookingId: 'booking123', rating: 5, comment: 'Great!' };
      const result = await service.create('user123', dto);
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if not own booking', async () => {
      bookingModel.findById.mockResolvedValue({
        ...mockBooking,
        user: 'other',
      });
      const dto = { bookingId: 'booking123', rating: 5, comment: 'Great!' };
      await expect(service.create('user123', dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException if already reviewed', async () => {
      bookingModel.findById.mockResolvedValue(mockBooking);
      reviewModel.findOne.mockResolvedValue({ _id: 'existing' });
      const dto = { bookingId: 'booking123', rating: 5, comment: 'Great!' };
      await expect(service.create('user123', dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('approve', () => {
    it('should approve review and update tour rating', async () => {
      const reviewInstance = {
        ...mockReview,
        save: jest.fn().mockResolvedValue(this),
      };
      reviewModel.findById.mockResolvedValue(reviewInstance);
      reviewModel.aggregate.mockResolvedValue([
        { _id: 'tour123', avgRating: 4.5, nRating: 1 },
      ]);

      const result = await service.approve('review123');
      expect(reviewInstance.status).toBe('approved');
      expect(tourModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete review and update rating if it was approved', async () => {
      reviewModel.findById.mockResolvedValue({
        ...mockReview,
        status: 'approved',
      });
      reviewModel.aggregate.mockResolvedValue([]);

      await service.delete('review123');
      expect(reviewModel.deleteOne).toHaveBeenCalledWith({ _id: 'review123' });
      expect(tourModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });
});
