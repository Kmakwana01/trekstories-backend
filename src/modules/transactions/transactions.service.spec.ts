import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction } from '../../database/schemas/transaction.schema';

const mockTransaction = {
  _id: 'transactionId',
  user: 'userId',
  amount: 1000,
  save: jest.fn().mockResolvedValue(true),
};

class MockTransactionModel {
  constructor(private data: any) {
    Object.assign(this, data);
  }
  save = jest.fn().mockResolvedValue(this);
  static find = jest.fn().mockReturnThis();
  static findOne = jest.fn().mockReturnThis();
  static sort = jest.fn().mockReturnThis();
  static populate = jest.fn().mockReturnThis();
  static exec = jest.fn().mockResolvedValue([mockTransaction]);
}

describe('TransactionsService', () => {
  let service: TransactionsService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction.name),
          useValue: MockTransactionModel,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    model = module.get(getModelToken(Transaction.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction', async () => {
    const dto = { user: 'userId', amount: 1000 };
    const result = await service.createTransaction(dto as any);
    expect(result).toBeDefined();
    expect(result.amount).toBe(1000);
  });

  it('should get user transactions', async () => {
    MockTransactionModel.exec.mockResolvedValueOnce([mockTransaction]);
    const result = await service.getUserTransactions('userId');
    expect(result).toEqual([mockTransaction]);
    expect(MockTransactionModel.find).toHaveBeenCalledWith({ user: 'userId' });
  });

  it('should get all transactions (admin)', async () => {
    (MockTransactionModel as any).exec.mockResolvedValueOnce([mockTransaction]);
    const result = await service.getAllTransactions();
    expect(result).toEqual([mockTransaction]);
    expect(MockTransactionModel.find).toHaveBeenCalled();
  });

  it('should get transaction by id', async () => {
    (MockTransactionModel as any).exec.mockResolvedValueOnce(mockTransaction);
    const result = await service.getTransactionById('transactionId', 'userId');
    expect(result).toEqual(mockTransaction);
    expect(MockTransactionModel.findOne).toHaveBeenCalledWith({
      _id: 'transactionId',
      user: 'userId',
    });
  });

  it('should export transactions to CSV', async () => {
    const mockDate = new Date();
    const transactions = [
      {
        createdAt: mockDate,
        transactionId: 'tx123',
        user: { email: 'test@example.com' },
        type: 'payment',
        amount: 100,
        status: 'success',
        paymentMethod: 'card',
        description: 'test',
      },
    ];
    jest
      .spyOn(service, 'getAllTransactions')
      .mockResolvedValue(transactions as any);

    const buffer = await service.exportToCSV({});
    expect(buffer).toBeInstanceOf(Buffer);
    const csvContent = buffer.toString();
    expect(csvContent).toContain(
      'Date,Transaction ID,User,Type,Amount,Status,Method,Description',
    );
    expect(csvContent).toContain(
      'tx123,test@example.com,payment,100,success,card,test',
    );
  });
});
