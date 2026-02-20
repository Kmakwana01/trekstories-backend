import { Test, TestingModule } from '@nestjs/testing';
import { AdminBlogsController } from './admin-blogs.controller';
import { BlogsService } from './blogs.service';
import { Role } from '../../common/enums/roles.enum';

describe('AdminBlogsController', () => {
    let controller: AdminBlogsController;
    let service: BlogsService;

    const mockBlogsService = {
        create: jest.fn().mockResolvedValue({ id: '1' }),
        findAllAdmin: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        findOneByIdAdmin: jest.fn().mockResolvedValue({ id: '1' }),
        update: jest.fn().mockResolvedValue({ id: '1' }),
        remove: jest.fn().mockResolvedValue(undefined),
        publish: jest.fn().mockResolvedValue({ id: '1', isPublished: true }),
        unpublish: jest.fn().mockResolvedValue({ id: '1', isPublished: false }),
    };

    const mockUser = { _id: { toString: () => 'author123' }, role: Role.ADMIN };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminBlogsController],
            providers: [
                {
                    provide: BlogsService,
                    useValue: mockBlogsService,
                },
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
        await controller.create(dto as any, mockUser as any);
        expect(service.create).toHaveBeenCalledWith(dto, 'author123');
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
        await controller.update('1', dto as any);
        expect(service.update).toHaveBeenCalledWith('1', dto);
    });

    it('should remove a blog', async () => {
        await controller.remove('1');
        expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should publish a blog', async () => {
        await controller.publish('1');
        expect(service.publish).toHaveBeenCalledWith('1');
    });

    it('should unpublish a blog', async () => {
        await controller.unpublish('1');
        expect(service.unpublish).toHaveBeenCalledWith('1');
    });
});
