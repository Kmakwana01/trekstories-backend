import { Test, TestingModule } from '@nestjs/testing';
import { AdminBlogsController } from './admin-blogs.controller';
import { BlogsService } from './blogs.service';
import { AdminLogService } from '../admin/services/admin-log.service';
import { Role } from '../../common/enums/roles.enum';

describe('AdminBlogsController', () => {
  let controller: AdminBlogsController;
  let service: BlogsService;

  const mockBlogsService = {
    create: jest.fn().mockResolvedValue({ _id: '1', id: '1' }),
    findAllAdmin: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    findOneByIdAdmin: jest.fn().mockResolvedValue({ id: '1' }),
    update: jest.fn().mockResolvedValue({ _id: '1', id: '1' }),
    remove: jest.fn().mockResolvedValue(undefined),
    publish: jest.fn().mockResolvedValue({ id: '1', isPublished: true }),
    unpublish: jest.fn().mockResolvedValue({ id: '1', isPublished: false }),
  };

  const mockAdminLogService = {
    logAction: jest.fn().mockResolvedValue(undefined),
  };
  const mockUser = { _id: { toString: () => 'author123' }, role: Role.ADMIN };
  const mockReq = { ip: '127.0.0.1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBlogsController],
      providers: [
        { provide: BlogsService, useValue: mockBlogsService },
        { provide: AdminLogService, useValue: mockAdminLogService },
      ],
    }).compile();

    controller = module.get<AdminBlogsController>(AdminBlogsController);
    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a blog', async () => {
    const dto = { title: 'Blog', content: 'Content' };
    await controller.create(
      dto as any,
      undefined as any,
      mockUser as any,
      mockReq as any,
    );
    expect(service.create).toHaveBeenCalled();
  });

  it('should find all blogs for admin', async () => {
    const dto = { page: 1, limit: 10 };
    await controller.findAll(dto as any);
    expect(service.findAllAdmin).toHaveBeenCalledWith(dto);
  });

  it('should find one blog by id', async () => {
    await controller.findOne('1');
    expect(service.findOneByIdAdmin).toHaveBeenCalledWith('1');
  });

  it('should update a blog', async () => {
    const dto = { title: 'Updated' };
    await controller.update(
      '1',
      dto as any,
      undefined as any,
      mockUser as any,
      mockReq as any,
    );
    expect(service.update).toHaveBeenCalled();
  });

  it('should remove a blog', async () => {
    await controller.remove('1', mockUser as any, mockReq as any);
    expect(service.remove).toHaveBeenCalledWith('1');
  });

  it('should publish a blog', async () => {
    await controller.publish('1', mockUser as any, mockReq as any);
    expect(service.publish).toHaveBeenCalledWith('1');
  });

  it('should unpublish a blog', async () => {
    await controller.unpublish('1', mockUser as any, mockReq as any);
    expect(service.unpublish).toHaveBeenCalledWith('1');
  });
});
