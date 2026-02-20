import { Test, TestingModule } from '@nestjs/testing';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';

describe('ToursController', () => {
    let controller: ToursController;
    let service: ToursService;

    const mockToursService = {
        getAllTours: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        getFilterOptions: jest.fn().mockResolvedValue({ states: [], categories: [] }),
        getByState: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        getTourBySlug: jest.fn().mockResolvedValue({ title: 'Tour' }),
        getTourDates: jest.fn().mockResolvedValue([]),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ToursController],
            providers: [
                {
                    provide: ToursService,
                    useValue: mockToursService,
                },
            ],
        }).compile();

        controller = module.get<ToursController>(ToursController);
        service = module.get<ToursService>(ToursService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call getAllTours', async () => {
        await controller.getAllTours({} as any);
        expect(service.getAllTours).toHaveBeenCalled();
    });

    it('should call getFilterOptions', async () => {
        await controller.getFilterOptions();
        expect(service.getFilterOptions).toHaveBeenCalled();
    });

    it('should call getByState', async () => {
        await controller.getByState('Goa', {} as any);
        expect(service.getByState).toHaveBeenCalledWith('Goa', {});
    });

    it('should call getTourBySlug', async () => {
        await controller.getTourBySlug('slug');
        expect(service.getTourBySlug).toHaveBeenCalledWith('slug');
    });

    it('should call getTourDates', async () => {
        await controller.getTourDates('id');
        expect(service.getTourDates).toHaveBeenCalledWith('id');
    });
});
