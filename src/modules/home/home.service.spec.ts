import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HomeService } from './home.service';
import { Tour } from '../../database/schemas/tour.schema';
import { TourDate } from '../../database/schemas/tour-date.schema';
import { Blog } from '../../database/schemas/blog.schema';
import { Coupon } from '../../database/schemas/coupon.schema';

describe('HomeService', () => {
    let service: HomeService;
    let cacheManager: any;

    const mockTourModel = {
        find: jest.fn(),
        aggregate: jest.fn(),
    };

    const mockTourDateModel = {
        find: jest.fn(),
    };

    const mockBlogModel = {
        find: jest.fn(),
    };

    const mockCouponModel = {
        find: jest.fn(),
    };

    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HomeService,
                { provide: getModelToken(Tour.name), useValue: mockTourModel },
                { provide: getModelToken(TourDate.name), useValue: mockTourDateModel },
                { provide: getModelToken(Blog.name), useValue: mockBlogModel },
                { provide: getModelToken(Coupon.name), useValue: mockCouponModel },
                { provide: CACHE_MANAGER, useValue: mockCacheManager },
            ],
        }).compile();

        service = module.get<HomeService>(HomeService);
        cacheManager = module.get(CACHE_MANAGER);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getFeaturedTours', () => {
        it('should return cached data if available', async () => {
            const cachedData = [{ title: 'Cached Tour' }];
            mockCacheManager.get.mockResolvedValue(cachedData);

            const result = await service.getFeaturedTours();

            expect(result).toEqual(cachedData);
            expect(mockCacheManager.get).toHaveBeenCalledWith('home_featured_tours');
            expect(mockTourModel.find).not.toHaveBeenCalled();
        });

        it('should fetch from DB and cache if not in cache', async () => {
            mockCacheManager.get.mockResolvedValue(null);
            const dbData = [{ title: 'DB Tour' }];
            mockTourModel.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(dbData),
            });

            const result = await service.getFeaturedTours();

            expect(result).toEqual(dbData);
            expect(mockCacheManager.set).toHaveBeenCalled();
        });
    });

    describe('getUpcomingDepartures', () => {
        it('should return cached data if available', async () => {
            const cachedData = [{ startDate: new Date() }];
            mockCacheManager.get.mockResolvedValue(cachedData);

            const result = await service.getUpcomingDepartures();

            expect(result).toEqual(cachedData);
        });

        it('should fetch from DB and cache if not in cache', async () => {
            mockCacheManager.get.mockResolvedValue(null);
            mockTourDateModel.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            });

            await service.getUpcomingDepartures();
            expect(mockCacheManager.set).toHaveBeenCalled();
        });
    });

    describe('getToursByState', () => {
        it('should return aggregated data', async () => {
            mockCacheManager.get.mockResolvedValue(null);
            const aggData = [{ state: 'Goa', tourCount: 5 }];
            mockTourModel.aggregate.mockResolvedValue(aggData);

            const result = await service.getToursByState();

            expect(result).toEqual(aggData);
            expect(mockCacheManager.set).toHaveBeenCalled();
        });
    });
});
