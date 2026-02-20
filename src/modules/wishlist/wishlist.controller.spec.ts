import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

describe('WishlistController', () => {
    let controller: WishlistController;
    let service: WishlistService;

    const mockWishlistService = {
        getWishlist: jest.fn().mockResolvedValue([]),
        addToWishlist: jest.fn().mockResolvedValue({ success: true }),
        removeFromWishlist: jest.fn().mockResolvedValue({ success: true }),
        toggleWishlist: jest.fn().mockResolvedValue({ success: true }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WishlistController],
            providers: [
                {
                    provide: WishlistService,
                    useValue: mockWishlistService,
                },
            ],
        }).compile();

        controller = module.get<WishlistController>(WishlistController);
        service = module.get<WishlistService>(WishlistService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call getWishlist', async () => {
        await controller.getWishlist('user1');
        expect(service.getWishlist).toHaveBeenCalledWith('user1');
    });

    it('should call addToWishlist', async () => {
        await controller.addToWishlist('user1', 'tour1');
        expect(service.addToWishlist).toHaveBeenCalledWith('user1', 'tour1');
    });

    it('should call removeFromWishlist', async () => {
        await controller.removeFromWishlist('user1', 'tour1');
        expect(service.removeFromWishlist).toHaveBeenCalledWith('user1', 'tour1');
    });

    it('should call toggleWishlist', async () => {
        await controller.toggleWishlist('user1', 'tour1');
        expect(service.toggleWishlist).toHaveBeenCalledWith('user1', 'tour1');
    });
});
