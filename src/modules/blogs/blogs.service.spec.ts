import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BlogsService } from './blogs.service';
import { Blog } from '../../database/schemas/blog.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BlogsService', () => {
    let service: BlogsService;
    let model: any;

    const mockBlog = {
        _id: 'blog123',
        title: 'Test Blog',
        slug: 'test-blog',
        content: 'Test Content',
        author: 'author123',
        isPublished: true,
        save: jest.fn().mockResolvedValue(this),
        viewCount: 0,
    };

    const mockBlogModel = {
        new: jest.fn().mockImplementation((dto) => ({
            ...dto,
            save: jest.fn().mockResolvedValue({ ...dto, _id: 'blog123' }),
        })),
        constructor: jest.fn().mockImplementation((dto) => ({
            ...dto,
            save: jest.fn().mockResolvedValue({ ...dto, _id: 'blog123' }),
        })),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
        countDocuments: jest.fn(),
    };

    // Special mock for 'new this.blogModel'
    function MockModel(dto: any) {
        this.data = dto;
        this.save = jest.fn().mockResolvedValue({ ...dto, _id: 'blog123' });
    }
    Object.assign(MockModel, mockBlogModel);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BlogsService,
                {
                    provide: getModelToken(Blog.name),
                    useValue: MockModel,
                },
            ],
        }).compile();

        service = module.get<BlogsService>(BlogsService);
        model = module.get(getModelToken(Blog.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new blog', async () => {
            model.findOne.mockResolvedValue(null);
            const dto = { title: 'New Blog', content: 'Content' };
            const result = await service.create(dto as any, 'author123');
            expect(result).toBeDefined();
            expect(model.findOne).toHaveBeenCalledWith({ slug: 'new-blog' });
        });

        it('should throw ConflictException if slug exists', async () => {
            model.findOne.mockResolvedValue({ _id: 'existing' });
            const dto = { title: 'New Blog', content: 'Content' };
            await expect(service.create(dto as any, 'author123')).rejects.toThrow(ConflictException);
        });
    });

    describe('findAllPublished', () => {
        it('should return paginated published blogs', async () => {
            const blogs = [mockBlog];
            model.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(blogs),
            });
            model.countDocuments.mockResolvedValue(1);

            const result = await service.findAllPublished({ page: 1, limit: 10 });
            expect(result.data).toEqual(blogs);
            expect(result.total).toBe(1);
        });
    });

    describe('findOneBySlug', () => {
        it('should return a blog and increment viewCount', async () => {
            const blogInstance = { ...mockBlog, save: jest.fn().mockResolvedValue(this) };
            model.findOne.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(blogInstance),
            });

            const result = await service.findOneBySlug('test-blog');
            expect(result).toBeDefined();
            expect(blogInstance.viewCount).toBe(1);
            expect(blogInstance.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if blog not found', async () => {
            model.findOne.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });
            await expect(service.findOneBySlug('no-blog')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a blog', async () => {
            const blogInstance = { ...mockBlog, save: jest.fn().mockResolvedValue(this) };
            model.findById.mockResolvedValue(blogInstance);
            model.findOne.mockResolvedValue(null);

            const result = await service.update('blog123', { title: 'Updated Title' });
            expect(blogInstance.title).toBe('Updated Title');
            expect(blogInstance.save).toHaveBeenCalled();
        });
    });

    describe('publish/unpublish', () => {
        it('should publish a blog', async () => {
            model.findByIdAndUpdate.mockResolvedValue({ ...mockBlog, isPublished: true });
            const result = await service.publish('blog123');
            expect(result.isPublished).toBe(true);
        });

        it('should unpublish a blog', async () => {
            model.findByIdAndUpdate.mockResolvedValue({ ...mockBlog, isPublished: false });
            const result = await service.unpublish('blog123');
            expect(result.isPublished).toBe(false);
        });
    });
});
