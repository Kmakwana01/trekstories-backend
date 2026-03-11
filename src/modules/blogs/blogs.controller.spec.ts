import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

describe('BlogsController', () => {
  let controller: BlogsController;
  let service: BlogsService;

  const mockBlogsService = {
    findAllPublished: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    findOneBySlug: jest.fn().mockResolvedValue({ title: 'Test Blog' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [
        {
          provide: BlogsService,
          useValue: mockBlogsService,
        },
      ],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAllPublished', async () => {
      const dto = { page: 1, limit: 10 };
      await controller.findAll(dto as any);
      expect(service.findAllPublished).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('should call service.findOneBySlug', async () => {
      const slug = 'test-blog';
      await controller.findOne(slug);
      expect(service.findOneBySlug).toHaveBeenCalledWith(slug);
    });
  });
});
