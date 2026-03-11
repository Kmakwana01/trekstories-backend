import { Test, TestingModule } from '@nestjs/testing';
import {
  CouponsController,
  AdminCouponsController,
} from './coupons.controller';
import { CouponsService } from './coupons.service';
import { AdminLogService } from '../admin/services/admin-log.service';

describe('Coupons Controllers', () => {
  let controller: CouponsController;
  let adminController: AdminCouponsController;
  let service: CouponsService;

  const mockCouponsService = {
    validateCoupon: jest
      .fn()
      .mockResolvedValue({ valid: true, discountAmount: 100 }),
    create: jest.fn().mockResolvedValue({ _id: '1', code: 'SAVE10' }),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ _id: '1', code: 'SAVE10' }),
    update: jest.fn().mockResolvedValue({ _id: '1', code: 'SAVE10' }),
    remove: jest.fn().mockResolvedValue(undefined),
    getCouponUsage: jest.fn().mockResolvedValue({ data: [], total: 0 }),
  };

  const mockAdminLogService = {
    logAction: jest.fn().mockResolvedValue(undefined),
  };
  const mockUser = { _id: 'user1' };
  const mockReq = { ip: '127.0.0.1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponsController, AdminCouponsController],
      providers: [
        { provide: CouponsService, useValue: mockCouponsService },
        { provide: AdminLogService, useValue: mockAdminLogService },
      ],
    }).compile();

    controller = module.get<CouponsController>(CouponsController);
    adminController = module.get<AdminCouponsController>(
      AdminCouponsController,
    );
    service = module.get<CouponsService>(CouponsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(adminController).toBeDefined();
  });

  describe('CouponsController', () => {
    it('should validate a coupon', async () => {
      const dto = { code: 'SAVE10', tourId: 'tour1', orderAmount: 1000 };
      const result = await controller.validate(dto as any, mockUser);
      expect(result).toEqual({ valid: true, discountAmount: 100 });
      expect(service.validateCoupon).toHaveBeenCalledWith(
        dto.code,
        mockUser._id,
        dto.tourId,
        dto.orderAmount,
      );
    });
  });

  describe('AdminCouponsController', () => {
    it('should create a coupon', async () => {
      const dto = {
        code: 'SAVE10',
        discountType: 'percent',
        discountValue: 10,
      };
      const result = await adminController.create(
        dto as any,
        'admin1',
        mockReq as any,
      );
      expect(result).toEqual({ _id: '1', code: 'SAVE10' });
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should find all coupons', async () => {
      const result = await adminController.findAll({});
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('should find one coupon', async () => {
      const result = await adminController.findOne('1');
      expect(result).toEqual({ _id: '1', code: 'SAVE10' });
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should update a coupon', async () => {
      const dto = { discountValue: 15 };
      const result = await adminController.update(
        '1',
        dto as any,
        'admin1',
        mockReq as any,
      );
      expect(result).toEqual({ _id: '1', code: 'SAVE10' });
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });

    it('should remove a coupon', async () => {
      const result = await adminController.remove(
        '1',
        'admin1',
        mockReq as any,
      );
      expect(result).toEqual({ message: 'Coupon deleted successfully' });
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should get coupon usage', async () => {
      const query = { page: 1, limit: 10 };
      const result = await adminController.getUsage('1', query);
      expect(result).toEqual({ data: [], total: 0 });
      expect(service.getCouponUsage).toHaveBeenCalledWith('1', query);
    });
  });
});
