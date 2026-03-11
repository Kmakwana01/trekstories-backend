import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Payment } from '../../database/schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentModel: any;

  const mockPayment = {
    _id: 'paymentId',
    user: 'userId',
    booking: {
      _id: 'bookingId',
      bookingNumber: 'TRV-123456',
      user: { name: 'Test User', email: 'test@example.com' },
      tour: { title: 'Test Tour' },
      toString: () => 'bookingId',
    },
    transactionId: 'tx123',
    amount: 1000,
    status: 'under_review',
    save: jest.fn().mockResolvedValue(true),
    paymentMethod: 'UPI',
  };

  const mockBookingsService = {
    getBookingById: jest.fn(),
    adminConfirmBooking: jest.fn(),
    adminUpdatePaidAmount: jest.fn(),
  };

  const mockTransactionsService = {
    createTransaction: jest.fn(),
  };

  const mockNotificationsService = {
    createNotification: jest.fn().mockResolvedValue({}),
    sendEmail: jest.fn().mockResolvedValue(true),
    sendWhatsApp: jest.fn().mockResolvedValue(true),
  };

  class MockPaymentModel {
    constructor(private data: any) {
      Object.assign(this, data);
    }
    save = jest.fn().mockResolvedValue(this);
    static find = jest.fn();
    static findOne = jest.fn();
    static findById = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken(Payment.name),
          useValue: MockPaymentModel,
        },
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentModel = module.get(getModelToken(Payment.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitPaymentProof', () => {
    it('should submit proof successfully', async () => {
      const dto = {
        bookingId: 'bookingId',
        transactionId: 'tx123',
        paymentMethod: 'UPI',
        receiptImage: 'img.jpg',
      };

      mockBookingsService.getBookingById.mockResolvedValue({
        status: 'pending',
        totalAmount: 1000,
        save: jest.fn().mockResolvedValue(true),
      });

      MockPaymentModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.submitPaymentProof('userId', dto);
      expect(result).toBeDefined();
    });

    it('should fail if booking not found', async () => {
      mockBookingsService.getBookingById.mockResolvedValue(null);
      await expect(
        service.submitPaymentProof('userId', {} as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should fail if transaction ID exists', async () => {
      mockBookingsService.getBookingById.mockResolvedValue({
        status: 'pending',
        totalAmount: 1000,
      });
      MockPaymentModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'existing' }),
      });

      const dto = { bookingId: 'bookingId', transactionId: 'tx123' };
      await expect(service.submitPaymentProof('userId', dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('approvePayment', () => {
    it('should approve payment', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      MockPaymentModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          ...mockPayment,
          status: 'under_review',
          save: mockSave,
        }),
      });

      mockBookingsService.getBookingById.mockResolvedValue({
        bookingNumber: 'TRV-123',
        user: { name: 'User', email: 'test@example.com' },
        tour: { title: 'Tour' },
      });

      mockBookingsService.adminConfirmBooking.mockResolvedValue({});

      const result = await service.approvePayment('paymentId', 'adminId');
      expect(result.status).toBe('success');
      expect(mockSave).toHaveBeenCalled();
      expect(mockBookingsService.adminConfirmBooking).toHaveBeenCalledWith(
        'bookingId',
      );
    });
  });

  describe('recordOfflinePayment', () => {
    it('should record offline payment', async () => {
      mockBookingsService.getBookingById.mockResolvedValue({
        _id: 'bookingId',
        user: { name: 'Test User', email: 'test@example.com' },
        status: 'pending',
        pendingAmount: 0,
        totalAmount: 1000,
      });

      mockBookingsService.adminConfirmBooking.mockResolvedValue({});

      const dto = {
        bookingId: 'bookingId',
        amount: 1000,
        paymentMethod: 'cash',
        receiptNumber: 'REC123',
      };

      const result = await service.recordOfflinePayment('adminId', dto);
      expect(result.paymentType).toBe('offline');
      expect(mockBookingsService.adminConfirmBooking).toHaveBeenCalledWith(
        'bookingId',
      );
    });
  });
});
