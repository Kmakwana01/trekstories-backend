import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUsersService = {
        getProfile: jest.fn().mockResolvedValue({ _id: '1', name: 'Test User' }),
        updateProfile: jest.fn().mockResolvedValue({ _id: '1', name: 'Updated name' }),
        changePassword: jest.fn().mockResolvedValue({ message: 'Password changed successfully' }),
        getSavedTravelers: jest.fn().mockResolvedValue([]),
        addSavedTraveler: jest.fn().mockResolvedValue([{ _id: 't1', fullName: 'Traveler One' }]),
        removeSavedTraveler: jest.fn().mockResolvedValue([]),
        getMyBookings: jest.fn().mockResolvedValue({ data: [], total: 0 }),
        getMyReviews: jest.fn().mockResolvedValue({ data: [], total: 0 }),
    };

    const mockUser = { _id: '1', email: 'test@test.com' };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const result = await controller.getProfile(mockUser);
            expect(result).toEqual({ _id: '1', name: 'Test User' });
            expect(service.getProfile).toHaveBeenCalledWith(mockUser._id);
        });
    });

    describe('updateProfile', () => {
        it('should update user profile', async () => {
            const dto = { name: 'Updated name' };
            const result = await controller.updateProfile(mockUser, dto as any);
            expect(result).toEqual({ _id: '1', name: 'Updated name' });
            expect(service.updateProfile).toHaveBeenCalledWith(mockUser._id, dto);
        });
    });

    describe('changePassword', () => {
        it('should change user password', async () => {
            const dto = { oldPassword: 'old', newPassword: 'new' };
            const result = await controller.changePassword(mockUser, dto as any);
            expect(result).toEqual({ message: 'Password changed successfully' });
            expect(service.changePassword).toHaveBeenCalledWith(mockUser._id, dto);
        });
    });

    describe('getTravelers', () => {
        it('should return saved travelers', async () => {
            const result = await controller.getTravelers(mockUser);
            expect(result).toEqual([]);
            expect(service.getSavedTravelers).toHaveBeenCalledWith(mockUser._id);
        });
    });

    describe('addTraveler', () => {
        it('should add a saved traveler', async () => {
            const dto = { fullName: 'Traveler One', age: 25, gender: 'male' };
            const result = await controller.addTraveler(mockUser, dto as any);
            expect(result).toEqual([{ _id: 't1', fullName: 'Traveler One' }]);
            expect(service.addSavedTraveler).toHaveBeenCalledWith(mockUser._id, dto);
        });
    });

    describe('removeTraveler', () => {
        it('should remove a saved traveler', async () => {
            const result = await controller.removeTraveler(mockUser, 't1');
            expect(result).toEqual([]);
            expect(service.removeSavedTraveler).toHaveBeenCalledWith(mockUser._id, 't1');
        });
    });

    describe('getMyBookings', () => {
        it('should return user bookings', async () => {
            const query = { page: 1, limit: 10 };
            const result = await controller.getMyBookings(mockUser, query);
            expect(result).toEqual({ data: [], total: 0 });
            expect(service.getMyBookings).toHaveBeenCalledWith(mockUser._id, query);
        });
    });

    describe('getMyReviews', () => {
        it('should return user reviews', async () => {
            const query = { page: 1, limit: 10 };
            const result = await controller.getMyReviews(mockUser, query);
            expect(result).toEqual({ data: [], total: 0 });
            expect(service.getMyReviews).toHaveBeenCalledWith(mockUser._id, query);
        });
    });
});
