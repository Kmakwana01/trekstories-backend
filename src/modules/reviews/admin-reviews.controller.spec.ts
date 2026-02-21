import { Test, TestingModule } from '@nestjs/testing';
import { AdminReviewsController } from './admin-reviews.controller';
import { ReviewsService } from './reviews.service';
import { AdminLogService } from '../admin/services/admin-log.service';

describe('AdminReviewsController', () => {
    let controller: AdminReviewsController;
    let service: ReviewsService;

    const mockReviewsService = {
        findAllAdmin: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        approve: jest.fn().mockResolvedValue({ id: '1', status: 'approved' }),
        reject: jest.fn().mockResolvedValue({ id: '1', status: 'rejected' }),
        delete: jest.fn().mockResolvedValue(undefined),
    };

    const mockAdminLogService = { logAction: jest.fn().mockResolvedValue(undefined) };
    const mockReq = { ip: '127.0.0.1' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminReviewsController],
            providers: [
                { provide: ReviewsService, useValue: mockReviewsService },
                { provide: AdminLogService, useValue: mockAdminLogService },
            ],
        }).compile();

        controller = module.get<AdminReviewsController>(AdminReviewsController);
        service = module.get<ReviewsService>(ReviewsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should find all reviews for admin', async () => {
        const dto = { status: 'pending' };
        await controller.findAll(dto as any);
        expect(service.findAllAdmin).toHaveBeenCalledWith(dto);
    });

    it('should approve a review', async () => {
        await controller.approve('1', 'admin1', mockReq as any);
        expect(service.approve).toHaveBeenCalledWith('1');
    });

    it('should reject a review', async () => {
        await controller.reject('1', { reason: 'bad' }, 'admin1', mockReq as any);
        expect(service.reject).toHaveBeenCalledWith('1', 'bad');
    });

    it('should delete a review', async () => {
        await controller.remove('1', 'admin1', mockReq as any);
        expect(service.delete).toHaveBeenCalledWith('1');
    });
});
