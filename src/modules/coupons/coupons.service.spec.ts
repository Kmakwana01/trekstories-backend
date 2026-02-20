import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CouponsService } from './coupons.service';
import { Coupon } from '../../database/schemas/coupon.schema';
import { Booking } from '../../database/schemas/booking.schema';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('CouponsService', () => {
    let service: CouponsService;
    let model: any;
    let bookingModel: any;

    const mockCoupon = {
        _id: 'coupon-id',
        code: 'WELCOME10',
        discountType: 'percent',
        discountValue: 10,
        isActive: true,
        usedCount: 0,
        save: jest.fn().mockResolvedValue({}),
    };

    const mockCouponModel = {
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        findOneAndUpdate: jest.fn(),
        updateOne: jest.fn(),
        exec: jest.fn(),
    };

    const mockBookingModel = {
        countDocuments: jest.fn(),
    };

    const MockModel = jest.fn().mockImplementation((dto) => ({
        ...dto,
        save: jest.fn().mockResolvedValue({ _id: 'new-id', ...dto }),
    }));
    Object.assign(MockModel, mockCouponModel);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CouponsService,
                {
                    provide: getModelToken(Coupon.name),
                    useValue: MockModel,
                },
                {
                    provide: getModelToken(Booking.name),
                    useValue: mockBookingModel,
                },
            ],
        }).compile();

        service = module.get<CouponsService>(CouponsService);
        model = module.get(getModelToken(Coupon.name));
        bookingModel = module.get(getModelToken(Booking.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a coupon', async () => {
            const dto = { code: 'NEW10', discountType: 'percent', discountValue: 10 };
            model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

            // Mock constructor behavior
            const saveMock = jest.fn().mockResolvedValue({ _id: 'new-id', ...dto, code: 'NEW10' });
            model.mockImplementationOnce(() => ({
                save: saveMock
            }));

            const result = await service.create(dto as any);
            expect(result).toBeDefined();
            expect(model.findOne).toHaveBeenCalledWith({ code: 'NEW10' });
        });

        it('should throw ConflictException if coupon exists', async () => {
            model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCoupon) });
            await expect(service.create({ code: 'WELCOME10' } as any)).rejects.toThrow(ConflictException);
        });
    });

    describe('validateCoupon', () => {
        it('should validate a valid coupon', async () => {
            model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCoupon) });
            const result = await service.validateCoupon('WELCOME10', 'user-id', 'tour-id', 1000);
            expect(result.valid).toBe(true);
            expect(result.discountAmount).toBe(100);
            expect(result.finalAmount).toBe(900);
        });

        it('should throw BadRequestException if coupon not found', async () => {
            model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
            await expect(service.validateCoupon('INVALID', 'user-id', 'tour-id', 1000)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if coupon expired', async () => {
            const expiredCoupon = { ...mockCoupon, expiryDate: new Date('2020-01-01') };
            model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(expiredCoupon) });
            await expect(service.validateCoupon('EXPIRED', 'user-id', 'tour-id', 1000)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if max usage reached', async () => {
            const fullCoupon = { ...mockCoupon, maxUsage: 10, usedCount: 10 };
            model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(fullCoupon) });
            await expect(service.validateCoupon('FULL', 'user-id', 'tour-id', 1000)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if below min order amount', async () => {
            const minCoupon = { ...mockCoupon, minOrderAmount: 2000 };
            model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(minCoupon) });
            await expect(service.validateCoupon('MIN', 'user-id', 'tour-id', 1000)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if not applicable to tour', async () => {
            const restrictedCoupon = { ...mockCoupon, applicableTours: ['other-tour-id'] };
            model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(restrictedCoupon) });
            await expect(service.validateCoupon('RESTRICTED', 'user-id', 'tour-id', 1000)).rejects.toThrow(BadRequestException);
        });
    });

    describe('applyCoupon', () => {
        it('should increment usedCount', async () => {
            model.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCoupon) });
            await service.applyCoupon('WELCOME10');
            expect(model.findOneAndUpdate).toHaveBeenCalledWith(
                { code: 'WELCOME10' },
                { $inc: { usedCount: 1 } },
                { new: true }
            );
        });
    });

    describe('releaseCoupon', () => {
        it('should decrement usedCount', async () => {
            model.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCoupon) });
            await service.releaseCoupon('WELCOME10');
            expect(model.findOneAndUpdate).toHaveBeenCalledWith(
                { code: 'WELCOME10' },
                { $inc: { usedCount: -1 } },
                { new: true }
            );
        });
    });
});
