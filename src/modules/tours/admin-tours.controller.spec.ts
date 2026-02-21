import { Test, TestingModule } from '@nestjs/testing';
import { AdminToursController } from './admin-tours.controller';
import { ToursService } from './tours.service';
import { AdminLogService } from '../admin/services/admin-log.service';

describe('AdminToursController', () => {
    let controller: AdminToursController;
    let service: ToursService;

    const mockToursService = {
        adminGetTours: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        adminCreateTour: jest.fn().mockResolvedValue({ id: '1' }),
        adminGetTourById: jest.fn().mockResolvedValue({ id: '1' }),
        adminUpdateTour: jest.fn().mockResolvedValue({ id: '1' }),
        adminSoftDelete: jest.fn().mockResolvedValue(undefined),
        toggleStatus: jest.fn().mockResolvedValue({ id: '1', isActive: false }),
        toggleFeatured: jest.fn().mockResolvedValue({ id: '1', isFeatured: true }),
        removeImage: jest.fn().mockResolvedValue(undefined),
    };

    const mockAdminLogService = { logAction: jest.fn().mockResolvedValue(undefined) };
    const mockReq = { ip: '127.0.0.1' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminToursController],
            providers: [
                { provide: ToursService, useValue: mockToursService },
                { provide: AdminLogService, useValue: mockAdminLogService },
            ],
        }).compile();

        controller = module.get<AdminToursController>(AdminToursController);
        service = module.get<ToursService>(ToursService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call adminGetTours', async () => {
        await controller.getTours({} as any);
        expect(service.adminGetTours).toHaveBeenCalled();
    });

    it('should call adminCreateTour', async () => {
        const dto = { title: 'New' };
        await controller.createTour(dto as any, {} as any, 'admin1', mockReq as any);
        expect(service.adminCreateTour).toHaveBeenCalledWith(dto, [], undefined);
    });

    it('should call adminGetTourById', async () => {
        await controller.getTourById('1');
        expect(service.adminGetTourById).toHaveBeenCalledWith('1');
    });

    it('should call adminUpdateTour', async () => {
        const dto = { title: 'Update' };
        await controller.updateTour('1', dto as any, {} as any, 'admin1', mockReq as any);
        expect(service.adminUpdateTour).toHaveBeenCalledWith('1', dto, [], undefined);
    });

    it('should call adminSoftDelete', async () => {
        await controller.deleteTour('1', 'admin1', mockReq as any);
        expect(service.adminSoftDelete).toHaveBeenCalledWith('1');
    });

    it('should call toggleStatus', async () => {
        await controller.toggleStatus('1', 'admin1', mockReq as any);
        expect(service.toggleStatus).toHaveBeenCalledWith('1');
    });

    it('should call toggleFeatured', async () => {
        await controller.toggleFeatured('1', 'admin1', mockReq as any);
        expect(service.toggleFeatured).toHaveBeenCalledWith('1');
    });

    it('should call removeImage', async () => {
        await controller.deleteImage('1', 'url', 'admin1', mockReq as any);
        expect(service.removeImage).toHaveBeenCalledWith('1', 'url');
    });
});
