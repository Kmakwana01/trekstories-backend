import { Test, TestingModule } from '@nestjs/testing';
import { paginate } from '../src/common/helpers/pagination.helper';
import { generateSlug } from '../src/common/helpers/slug.helper';
import { Role } from '../src/common/enums/roles.enum';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { Reflector } from '@nestjs/core';

describe('Phase 2: Common Infrastructure', () => {
    describe('Pagination Helper', () => {
        it('should return correct pagination result', async () => {
            const mockModel = {
                find: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(['item1', 'item2']),
                countDocuments: jest.fn().mockReturnValue({
                    exec: jest.fn().mockResolvedValue(20),
                }),
            };

            const result = await paginate(mockModel, {}, { page: 2, limit: 5 });
            expect(result.page).toBe(2);
            expect(result.limit).toBe(5);
            expect(result.total).toBe(20);
            expect(result.totalPages).toBe(4);
            expect(result.hasNext).toBe(true);
            expect(result.hasPrev).toBe(true);
        });
    });

    describe('Slug Helper', () => {
        it('should generate valid slug', () => {
            const slug = generateSlug('Hello World! This is a Test.');
            expect(slug).toBe('hello-world-this-is-a-test');
        });
    });

    describe('RolesEnum', () => {
        it('should have ADMIN and CUSTOMER roles', () => {
            expect(Role.ADMIN).toBe('admin');
            expect(Role.CUSTOMER).toBe('customer');
        });
    });
});
