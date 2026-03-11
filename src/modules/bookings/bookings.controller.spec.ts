import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { AdminBookingsController } from './admin-bookings.controller';
import { BookingsService } from './bookings.service';
import { AdminLogService } from '../admin/services/admin-log.service';

describe('Bookings Controllers', () => {
  let controller: BookingsController;
  let adminController: AdminBookingsController;
  let service: BookingsService;

  const mockBookingsService = {
    previewBooking: jest.fn().mockResolvedValue({ totalAmount: 100 }),
    createBooking: jest.fn().mockResolvedValue({ id: '1' }),
    getMyBookings: jest.fn().mockResolvedValue([]),
    getBookingById: jest.fn().mockResolvedValue({ id: '1' }),
    cancelBooking: jest.fn().mockResolvedValue({ success: true }),
    adminGetAllBookings: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    adminUpdateStatus: jest
      .fn()
      .mockResolvedValue({ id: '1', status: 'confirmed' }),
    adminConfirmBooking: jest
      .fn()
      .mockResolvedValue({ id: '1', status: 'confirmed' }),
    adminUpdatePaidAmount: jest
      .fn()
      .mockResolvedValue({ id: '1', paidAmount: 100 }),
  };

  const mockAdminLogService = {
    logAction: jest.fn().mockResolvedValue(undefined),
  };
  const mockReq = { ip: '127.0.0.1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController, AdminBookingsController],
      providers: [
        { provide: BookingsService, useValue: mockBookingsService },
        { provide: AdminLogService, useValue: mockAdminLogService },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    adminController = module.get<AdminBookingsController>(
      AdminBookingsController,
    );
    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(adminController).toBeDefined();
  });

  describe('BookingsController', () => {
    it('should call previewBooking', async () => {
      const dto = { tourDateId: '1', travelerCount: 2 };
      await controller.preview(dto as any);
      expect(service.previewBooking).toHaveBeenCalledWith(dto);
    });

    it('should call createBooking', async () => {
      const dto = { tourId: '1', tourDateId: '1' };
      await controller.create('user1', dto as any);
      expect(service.createBooking).toHaveBeenCalledWith('user1', dto);
    });

    it('should call getMyBookings', async () => {
      await controller.getMyBookings('user1');
      expect(service.getMyBookings).toHaveBeenCalledWith('user1');
    });

    it('should call getBookingById', async () => {
      await controller.getBookingById('user1', '1');
      expect(service.getBookingById).toHaveBeenCalledWith('1', 'user1');
    });

    it('should call cancelBooking', async () => {
      await controller.cancelBooking('user1', '1');
      expect(service.cancelBooking).toHaveBeenCalledWith('1', 'user1');
    });
  });

  describe('AdminBookingsController', () => {
    it('should call adminGetAllBookings', async () => {
      await adminController.getAllBookings({ status: 'pending' });
      expect(service.adminGetAllBookings).toHaveBeenCalledWith({
        status: 'pending',
      });
    });

    it('should call getBookingById', async () => {
      await adminController.getBookingById('1');
      expect(service.getBookingById).toHaveBeenCalledWith('1');
    });

    it('should call adminUpdateStatus', async () => {
      await adminController.updateStatus(
        '1',
        'confirmed',
        'note',
        'admin1',
        mockReq as any,
      );
      expect(service.adminUpdateStatus).toHaveBeenCalledWith(
        '1',
        'confirmed',
        'note',
      );
    });

    it('should call adminConfirmBooking', async () => {
      await adminController.confirmBooking('1', 'admin1', mockReq as any);
      expect(service.adminConfirmBooking).toHaveBeenCalledWith('1');
    });

    it('should call adminUpdatePaidAmount', async () => {
      await adminController.addPayment('1', 100, 'admin1', mockReq as any);
      expect(service.adminUpdatePaidAmount).toHaveBeenCalledWith('1', 100);
    });
  });
});
