import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WishlistService } from './wishlist.service';
import { User } from '../../database/schemas/user.schema';
import { Tour } from '../../database/schemas/tour.schema';
import { NotFoundException } from '@nestjs/common';

describe('WishlistService', () => {
    let service: WishlistService;
    let userModel: any;
    let tourModel: any;

    const mockTour = {
        _id: 'tour123',
        title: 'Test Tour',
        isActive: true,
    };

    const mockUser = {
        _id: 'user123',
        wishlist: [],
        save: jest.fn(),
    };

    const mockUserModel = {
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
    };

    const mockTourModel = {
        findById: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WishlistService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockUserModel,
                },
                {
                    provide: getModelToken(Tour.name),
                    useValue: mockTourModel,
                },
            ],
        }).compile();

        service = module.get<WishlistService>(WishlistService);
        userModel = module.get(getModelToken(User.name));
        tourModel = module.get(getModelToken(Tour.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('addToWishlist', () => {
        it('should add a tour to the wishlist', async () => {
            tourModel.findById.mockResolvedValue(mockTour);
            userModel.findByIdAndUpdate.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ ...mockUser, wishlist: [mockTour] }),
            });

            const result = await service.addToWishlist('user123', 'tour123');
            expect(result.wishlist).toHaveLength(1);
            expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
        });

        it('should throw NotFoundException if tour not found', async () => {
            tourModel.findById.mockResolvedValue(null);
            await expect(service.addToWishlist('user123', 'tour123'))
                .rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if tour is inactive', async () => {
            tourModel.findById.mockResolvedValue({ ...mockTour, isActive: false });
            await expect(service.addToWishlist('user123', 'tour123'))
                .rejects.toThrow(NotFoundException);
        });
    });

    describe('removeFromWishlist', () => {
        it('should remove a tour from the wishlist', async () => {
            userModel.findByIdAndUpdate.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ ...mockUser, wishlist: [] }),
            });

            const result = await service.removeFromWishlist('user123', 'tour123');
            expect(result.wishlist).toHaveLength(0);
            expect(userModel.findByIdAndUpdate).toHaveBeenCalled();
        });
    });

    describe('getWishlist', () => {
        it('should return the user wishlist', async () => {
            userModel.findById.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ ...mockUser, wishlist: [mockTour] }),
            });

            const result = await service.getWishlist('user123');
            expect(result).toHaveLength(1);
            expect(result[0].title).toBe('Test Tour');
        });
    });

    describe('toggleWishlist', () => {
        it('should add to wishlist if not present', async () => {
            userModel.findById.mockResolvedValue({ ...mockUser, wishlist: [] });
            tourModel.findById.mockResolvedValue(mockTour);

            // Mock addToWishlist indirectly by mocking findByIdAndUpdate
            userModel.findByIdAndUpdate.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ ...mockUser, wishlist: [mockTour] }),
            });

            const result = await service.toggleWishlist('user123', 'tour123');
            expect(result.added).toBe(true);
        });

        it('should remove from wishlist if already present', async () => {
            userModel.findById.mockResolvedValue({ ...mockUser, wishlist: [mockTour._id] });

            userModel.findByIdAndUpdate.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ ...mockUser, wishlist: [] }),
            });

            const result = await service.toggleWishlist('user123', 'tour123');
            expect(result.added).toBe(false);
        });
    });
});
