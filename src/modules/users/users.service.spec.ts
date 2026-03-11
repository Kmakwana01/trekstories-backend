import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../database/schemas/user.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  genSalt: jest.fn().mockResolvedValue('salt'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const mockUser = {
    _id: 'userId',
    passwordHash: 'oldHash',
    savedTravelers: [],
    save: jest.fn().mockResolvedValue(this),
    toObject: jest.fn().mockImplementation(function () {
      const { passwordHash, ...rest } = this;
      return rest;
    }),
  };

  const mockUserModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken('Booking'),
          useValue: {},
        },
        {
          provide: getModelToken('Review'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return sanitized user', async () => {
      userModel.findById.mockResolvedValue(mockUser);
      const result = await service.getProfile('userId');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result._id).toBe('userId');
    });

    it('should throw NotFoundException if user not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(service.getProfile('none')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('changePassword', () => {
    it('should change password with valid old password', async () => {
      userModel.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.changePassword('userId', {
        oldPassword: 'old',
        newPassword: 'new',
      });

      expect(result.message).toContain('successfully');
    });

    it('should throw BadRequestException for invalid old password', async () => {
      userModel.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('userId', {
          oldPassword: 'wrong',
          newPassword: 'new',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('travelers', () => {
    it('should add a traveler', async () => {
      userModel.findByIdAndUpdate.mockResolvedValue({
        ...mockUser,
        savedTravelers: [{ fullName: 'John Doe' }],
      });

      const result = await service.addSavedTraveler('userId', {
        fullName: 'John Doe',
        age: 30,
        gender: 'male',
        idNumber: '123',
      });

      expect(result).toHaveLength(1);
    });
  });
});
