import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { Notification } from '../../database/schemas/notification.schema';
import { getQueueToken } from '@nestjs/bull';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let model: any;
  let emailQueue: any;
  let whatsappQueue: any;

  const mockNotification = {
    _id: 'notif123',
    user: 'user123',
    type: 'general',
    title: 'Test Title',
    message: 'Test Message',
    isRead: false,
  };

  const mockNotificationModel = {
    new: jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...data, _id: 'notif123' }),
    })),
    constructor: jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({ ...data, _id: 'notif123' }),
    })),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    updateMany: jest.fn(),
    countDocuments: jest.fn(),
  };

  // Fix for the 'new Model()' pattern in service
  const MockModel: ((dto: any) => void) & {
    find: jest.Mock;
    countDocuments: jest.Mock;
    findOneAndUpdate: jest.Mock;
    updateMany: jest.Mock;
  } = Object.assign(
    function MockModel(this: any, dto: any) {
      this.data = dto;
      this.save = jest.fn().mockResolvedValue({ ...dto, _id: 'notif123' });
    },
    {
      find: jest.fn(),
      countDocuments: jest.fn(),
      findOneAndUpdate: jest.fn(),
      updateMany: jest.fn(),
    },
  ) as any;

  const mockEmailQueue = {
    add: jest.fn(),
  };

  const mockWhatsappQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: getModelToken(Notification.name),
          useValue: MockModel,
        },
        {
          provide: getQueueToken('email'),
          useValue: mockEmailQueue,
        },
        {
          provide: getQueueToken('whatsapp'),
          useValue: mockWhatsappQueue,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    model = module.get(getModelToken(Notification.name));
    emailQueue = module.get(getQueueToken('email'));
    whatsappQueue = module.get(getQueueToken('whatsapp'));

    // Add static methods to MockModel
    MockModel.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockNotification]),
    });
    MockModel.countDocuments = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });
    MockModel.findOneAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ ...mockNotification, isRead: true }),
    });
    MockModel.updateMany = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({ nModified: 1 }),
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a notification', async () => {
    const result = await service.createNotification(
      'user123',
      'general',
      'Title',
      'Msg',
    );
    expect(result).toBeDefined();
    expect(result.title).toBe('Title');
  });

  it('should get notifications', async () => {
    const result = await service.getNotifications('user123', {
      page: 1,
      limit: 10,
    });
    expect(result.items).toBeDefined();
    expect(result.total).toBe(1);
  });

  it('should mark as read', async () => {
    const result = await service.markRead('user123', 'notif123');
    expect(result.isRead).toBe(true);
  });

  it('should send email to queue', async () => {
    await service.sendEmail('test@test.com', 'Subject', 'otp', {
      otp: '123456',
    });
    expect(emailQueue.add).toHaveBeenCalledWith('send-email', {
      to: 'test@test.com',
      subject: 'Subject',
      template: 'otp',
      context: { otp: '123456', message: '', year: new Date().getFullYear() },
    });
  });

  it('should send whatsapp to queue', async () => {
    await service.sendWhatsApp('919876543210', 'Test Message');
    expect(whatsappQueue.add).toHaveBeenCalledWith('send-whatsapp', {
      phone: '919876543210',
      message: 'Test Message',
      template: undefined,
      context: undefined,
    });
  });
});
