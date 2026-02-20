import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Payment } from '../../database/schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

const mockPayment = {
  _id: 'paymentId',
  user: 'userId',
  booking: 'bookingId',
  transactionId: 'tx123',
  amount: 1000,
  status: 'under_review',
  save: jest.fn().mockResolvedValue(true),
  paymentMethod: 'UPI',
};

class MockPaymentModel {
  constructor(private data: any) {
    Object.assign(this, data);
  }
  save = jest.fn().mockResolvedValue(this);
  static find = jest.fn().mockReturnThis();
  static findOne = jest.fn().mockReturnThis();
  static findById = jest.fn().mockReturnThis();
  static sort = jest.fn().mockReturnThis();
  static populate = jest.fn().mockReturnThis();
  static exec = jest.fn().mockResolvedValue([mockPayment]);
}

const mockBookingsService = {
  getBookingById: jest.fn(),
  adminConfirmBooking: jest.fn(),
  adminUpdatePaidAmount: jest.fn(),
};

const mockTransactionsService = {
  createTransaction: jest.fn(),
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentModel: any;

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
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentModel = module.get(getModelToken(Payment.name));
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
        receiptImage: 'img.jpg'
      };

      mockBookingsService.getBookingById.mockResolvedValue({ status: 'pending', totalAmount: 1000 });
      MockPaymentModel.findOne.mockResolvedValue(null);

      const result = await service.submitPaymentProof('userId', dto);
      expect(result).toBeDefined();
      expect(result.status).toBe('under_review');
    });

    it('should fail if booking not found', async () => {
      mockBookingsService.getBookingById.mockResolvedValue(null);
      await expect(service.submitPaymentProof('userId', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should fail if transaction ID exists', async () => {
      mockBookingsService.getBookingById.mockResolvedValue({ status: 'pending', totalAmount: 1000 });
      MockPaymentModel.findOne.mockResolvedValue({ _id: 'existing' });

      const dto = { bookingId: 'bookingId', transactionId: 'tx123' };
      await expect(service.submitPaymentProof('userId', dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('approvePayment', () => {
    it('should approve payment', async () => {
      MockPaymentModel.findById.mockResolvedValue({
        ...mockPayment,
        booking: 'bookingId', // Ensure booking is returned as string or object with toString
        status: 'under_review',
        save: jest.fn().mockResolvedValue(true),
      });

      const result = await service.approvePayment('paymentId', 'adminId');
      expect(result.status).toBe('success');
      expect(mockBookingsService.adminConfirmBooking).toHaveBeenCalledWith('bookingId');
      expect(mockTransactionsService.createTransaction).toHaveBeenCalled();
    });
  });

  describe('recordOfflinePayment', () => {
    it('should record offline payment', async () => {
      mockBookingsService.getBookingById.mockResolvedValue({
        _id: 'bookingId',
        user: 'userId',
        status: 'pending',
        pendingAmount: 0 // Simulate full payment
      });

      const dto = {
        bookingId: 'bookingId',
        amount: 1000,
        paymentMethod: 'cash',
        receiptNumber: 'REC123'
      };

      const result = await service.recordOfflinePayment('adminId', dto);
      expect(result.paymentType).toBe('offline');
      expect(mockBookingsService.adminConfirmBooking).toHaveBeenCalledWith('bookingId');
      expect(mockTransactionsService.createTransaction).toHaveBeenCalled();
    });
  });
});
