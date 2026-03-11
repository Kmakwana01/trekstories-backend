import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  const mockReviewsService = {
    create: jest.fn().mockResolvedValue({ id: '1' }),
    findAllByTour: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    findAllByUser: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: mockReviewsService,
        },
      ],
    }).compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const mockUser = { _id: { toString: () => 'user1' } };

  it('should create a review', async () => {
    const dto = { bookingId: '1', rating: 5, comment: 'Great' };
    await controller.create(dto as any, mockUser as any);
    expect(service.create).toHaveBeenCalledWith('user1', dto);
  });

  it('should find reviews by tour', async () => {
    await controller.findAllByTour('tour1', 1, 10);
    expect(service.findAllByTour).toHaveBeenCalledWith('tour1', 1, 10);
  });

  it('should find reviews by user', async () => {
    await controller.findAllMyReviews(mockUser as any);
    expect(service.findAllByUser).toHaveBeenCalledWith('user1');
  });
});
