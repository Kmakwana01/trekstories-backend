import { Test, TestingModule } from '@nestjs/testing';
import { AdminPaymentsController } from './admin-payments.controller';
import { PaymentsService } from '../payments.service';
import { AdminLogService } from '../../admin/services/admin-log.service';

describe('AdminPaymentsController', () => {
  let controller: AdminPaymentsController;

  const mockPaymentsService = {
    getPendingPayments: jest.fn(),
    approvePayment: jest.fn(),
    rejectPayment: jest.fn(),
    recordOfflinePayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
        {
          provide: AdminLogService,
          useValue: { logAction: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AdminPaymentsController>(AdminPaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
