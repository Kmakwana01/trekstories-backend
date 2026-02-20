import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { CouponsService } from '../coupons/coupons.service';
import { Booking } from '../../database/schemas/booking.schema';
import { Tour } from '../../database/schemas/tour.schema';
import { TourDate } from '../../database/schemas/tour-date.schema';
import { Coupon } from '../../database/schemas/coupon.schema';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

describe('BookingsService', () => {
    let service: BookingsService;
    let bookingModel: any;
    let tourModel: any;
    let tourDateModel: any;
    let couponsService: CouponsService;

    const mockCouponsService = {
        validateCoupon: jest.fn(),
        applyCoupon: jest.fn(),
        releaseCoupon: jest.fn(),
    };

    const mockTour = {
        _id: 'tour123',
        title: 'Test Tour',
        basePrice: 1000,
        departureOptions: [
            { fromCity: 'City A', priceAdjustment: 200 }
        ]
    };

    const mockTourDate = {
        _id: 'date123',
        tour: 'tour123',
        totalSeats: 10,
        bookedSeats: 5,
        priceOverride: 1100,
    };

    const mockBooking = {
        _id: 'booking123',
        bookingNumber: 'TRV-123456',
        totalAmount: 1365,
        status: 'pending',
        tourDate: 'date123',
        totalTravelers: 1,
    };

    class MockBookingModel {
        constructor(public data: any) {
            Object.assign(this, data);
        }
        save = jest.fn().mockImplementation(async () => ({
            _id: 'booking123',
            ...this,
            toObject: jest.fn().mockReturnThis()
        }));
        static find = jest.fn().mockReturnThis();
        static findOne = jest.fn().mockReturnThis();
        static findById = jest.fn().mockReturnThis();
        static findByIdAndUpdate = jest.fn().mockReturnThis();
        static updateOne = jest.fn().mockReturnThis();
        static exec = jest.fn();
        static sort = jest.fn();
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingsService,
                {
                    provide: getModelToken(Booking.name),
                    useValue: MockBookingModel,
                },
                {
                    provide: getModelToken(Tour.name),
                    useValue: { findById: jest.fn() },
                },
                {
                    provide: getModelToken(TourDate.name),
                    useValue: {
                        findById: jest.fn(),
                        findByIdAndUpdate: jest.fn(),
                    },
                },
                {
                    provide: CouponsService,
                    useValue: mockCouponsService,
                },
            ],
        }).compile();

        service = module.get<BookingsService>(BookingsService);
        bookingModel = module.get(getModelToken(Booking.name));
        tourModel = module.get(getModelToken(Tour.name));
        tourDateModel = module.get(getModelToken(TourDate.name));
        couponsService = module.get<CouponsService>(CouponsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('previewBooking', () => {
        it('should calculate correct price breakdown', async () => {
            tourDateModel.findById.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({
                    ...mockTourDate,
                    tour: { ...mockTour }
                }),
            });

            const result = await service.previewBooking({
                tourDateId: 'date123',
                pickupOptionIndex: 0,
                travelerCount: 1,
            });

            expect(result.subtotal).toBe(1300);
            expect(result.totalAmount).toBe(1365);
        });

        it('should handle coupon in preview', async () => {
            tourDateModel.findById.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({
                    ...mockTourDate,
                    tour: { ...mockTour }
                }),
            });

            mockCouponsService.validateCoupon.mockResolvedValue({
                valid: true,
                discountAmount: 100,
                coupon: { code: 'SAVE10' }
            });

            const result = await service.previewBooking({
                tourDateId: 'date123',
                pickupOptionIndex: 0,
                travelerCount: 1,
                couponCode: 'SAVE10'
            });

            expect(result.couponDiscount).toBe(100);
            expect(result.totalAmount).toBe(1260); // 1300 - 100 = 1200, 1200 * 1.05 = 1260
        });
    });

    describe('createBooking', () => {
        it('should create a booking successfully', async () => {
            tourDateModel.findById.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({
                    ...mockTourDate,
                    tour: { ...mockTour }
                }),
            });
            // First call for preview, second call for creation check
            tourDateModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ ...mockTourDate, tour: mockTour }),
            }).mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(mockTourDate),
            });

            bookingModel.findOne.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await service.createBooking('user123', {
                tourDateId: 'date123',
                pickupOptionIndex: 0,
                travelers: [{ fullName: 'John Doe', age: 30, gender: 'male' }]
            });

            expect(result).toBeDefined();
            expect(result.totalAmount).toBe(1365);
        });

        it('should handle coupon usage during creation', async () => {
            tourDateModel.findById.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({
                    ...mockTourDate,
                    tour: mockTour
                }),
            });
            tourDateModel.findById.mockReturnValueOnce({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ ...mockTourDate, tour: mockTour }),
            }).mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(mockTourDate),
            });

            bookingModel.findOne.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });

            mockCouponsService.validateCoupon.mockResolvedValue({
                valid: true,
                discountAmount: 100,
                coupon: { code: 'SAVE10', discountType: 'flat', discountValue: 100 }
            });

            const result = await service.createBooking('user123', {
                tourDateId: 'date123',
                pickupOptionIndex: 0,
                travelers: [{ fullName: 'John Doe', age: 30, gender: 'male' }],
                couponCode: 'SAVE10'
            });

            expect(result.discountAmount).toBe(100);
            expect(mockCouponsService.applyCoupon).toHaveBeenCalledWith('SAVE10');
        });
    });

    describe('cancelBooking', () => {
        it('should cancel booking and release coupon', async () => {
            const mockSave = jest.fn().mockResolvedValue({ ...mockBooking, status: 'cancelled' });
            bookingModel.findOne.mockReturnThis();
            bookingModel.exec.mockResolvedValue({
                ...mockBooking,
                status: 'confirmed', // Must be confirmed to trigger seat release
                couponCode: 'SAVE10',
                save: mockSave
            });
            tourDateModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn() });

            await service.cancelBooking('booking123', 'user123');

            expect(mockCouponsService.releaseCoupon).toHaveBeenCalledWith('SAVE10');
            expect(tourDateModel.findByIdAndUpdate).toHaveBeenCalled();
        });
    });
});
