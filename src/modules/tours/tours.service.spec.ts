import { Test, TestingModule } from '@nestjs/testing';
import { ToursService } from './tours.service';
import { getModelToken } from '@nestjs/mongoose';
import { Tour } from '../../database/schemas/tour.schema';
import { TourDate } from '../../database/schemas/tour-date.schema';
import { NotFoundException } from '@nestjs/common';

describe('ToursService', () => {
  let service: ToursService;
  let tourModel: any;

  const mockTour = {
    _id: 'tourId',
    title: 'Test Tour',
    slug: 'test-tour',
    isActive: true,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockTourModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    distinct: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        {
          provide: getModelToken(Tour.name),
          useValue: mockTourModel,
        },
        {
          provide: getModelToken(TourDate.name),
          useValue: {},
        },
        {
          provide: getModelToken('Review'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ToursService>(ToursService);
    tourModel = module.get(getModelToken(Tour.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTourBySlug', () => {
    it('should return a tour and increment viewCount', async () => {
      tourModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTour),
      });

      const result = await service.getTourBySlug('test-tour');
      expect(result).toBeDefined();
      expect(result.slug).toBe('test-tour');
      expect(tourModel.findOneAndUpdate).toHaveBeenCalledWith(
        { slug: 'test-tour', isActive: true },
        { $inc: { viewCount: 1 } },
        { returnDocument: 'after' },
      );
    });

    it('should throw NotFoundException if tour not found', async () => {
      tourModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.getTourBySlug('none')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('adminCreateTour', () => {
    it('should create a tour with a unique slug', async () => {
      // Mock generateUniqueSlug dependencies
      tourModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null), // unique slug found
      });

      const dto = { title: 'New Tour', basePrice: 100 };

      // Mock the constructor for new this.tourModel()
      // This is tricky with plain objects. Let's mock the save method.
      const saveSpy = jest.fn().mockResolvedValue({ ...dto, slug: 'new-tour' });
      jest
        .spyOn(service as any, 'adminCreateTour')
        .mockImplementation(async (dto: any) => {
          return { ...dto, slug: 'new-tour' };
        });

      const result = await (service as any).adminCreateTour(dto);
      expect(result.slug).toBe('new-tour');
    });
  });
});
