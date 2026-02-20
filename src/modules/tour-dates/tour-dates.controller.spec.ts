import { Test, TestingModule } from '@nestjs/testing';
import { TourDatesController, AdminTourDatesController } from './tour-dates.controller';
import { TourDatesService } from './tour-dates.service';

describe('TourDates Controllers', () => {
    let controller: TourDatesController;
    let adminController: AdminTourDatesController;
    let service: TourDatesService;

    const mockTourDatesService = {
        getUpcomingDates: jest.fn().mockResolvedValue([]),
        adminGetTourDates: jest.fn().mockResolvedValue([]),
        adminCreateTourDate: jest.fn().mockResolvedValue({ id: '1' }),
        adminUpdateTourDate: jest.fn().mockResolvedValue({ id: '1' }),
        adminDeleteTourDate: jest.fn().mockResolvedValue(undefined),
        updateStatus: jest.fn().mockResolvedValue({ id: '1', status: 'full' }),
        autoUpdateStatuses: jest.fn().mockResolvedValue({ updated: 0 }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TourDatesController, AdminTourDatesController],
            providers: [
                {
                    provide: TourDatesService,
                    useValue: mockTourDatesService,
                },
            ],
        }).compile();

        controller = module.get<TourDatesController>(TourDatesController);
        adminController = module.get<AdminTourDatesController>(AdminTourDatesController);
        service = module.get<TourDatesService>(TourDatesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(adminController).toBeDefined();
    });

    describe('TourDatesController', () => {
        it('should call getUpcomingDates', async () => {
            await controller.getUpcomingDates('tour1');
            expect(service.getUpcomingDates).toHaveBeenCalledWith('tour1');
        });
    });

    describe('AdminTourDatesController', () => {
        it('should call adminGetTourDates', async () => {
            await adminController.getTourDates('tour1');
            expect(service.adminGetTourDates).toHaveBeenCalledWith('tour1');
        });

        it('should call adminCreateTourDate', async () => {
            const dto = { tour: 'tour1', startDate: new Date() };
            await adminController.createTourDate(dto as any);
            expect(service.adminCreateTourDate).toHaveBeenCalledWith(dto);
        });

        it('should call adminUpdateTourDate', async () => {
            const dto = { seats: 20 };
            await adminController.updateTourDate('1', dto as any);
            expect(service.adminUpdateTourDate).toHaveBeenCalledWith('1', dto);
        });

        it('should call adminDeleteTourDate', async () => {
            await adminController.deleteTourDate('1');
            expect(service.adminDeleteTourDate).toHaveBeenCalledWith('1');
        });

        it('should call updateStatus', async () => {
            await adminController.updateStatus('1', 'full');
            expect(service.updateStatus).toHaveBeenCalledWith('1', 'full');
        });

        it('should call autoUpdateStatuses', async () => {
            await adminController.triggerAutoUpdate();
            expect(service.autoUpdateStatuses).toHaveBeenCalled();
        });
    });
});
