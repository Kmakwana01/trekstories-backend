import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';

import { User } from '../../database/schemas/user.schema';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  genSalt: jest.fn().mockResolvedValue('salt'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    _id: 'mockId',
    email: 'test@example.com',
    role: 'customer',
    passwordHash: 'hashedPassword',
    refreshTokenHash: 'hashedRefresh',
    isVerified: true,
    isBlocked: false,
    save: jest.fn().mockResolvedValue(this),
    toObject: jest.fn().mockImplementation(function () {
      const { passwordHash, refreshTokenHash, ...rest } = this;
      return rest;
    }),
  };

  class MockUserConstructor {
    constructor(public data: any) {
      Object.assign(this, data, mockUser);
    }
    save = jest.fn().mockResolvedValue(this);
    static findOne = jest.fn();
    static findById = jest.fn();
    static findByIdAndUpdate = jest.fn();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserConstructor,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockToken'),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'jwt.secret') return 'secret';
              if (key === 'jwt.expiresIn') return '15m';
              if (key === 'jwt.refreshSecret') return 'refresh_secret';
              if (key === 'jwt.refreshExpiresIn') return '7d';
              return null;
            }),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue(true),
            sendWhatsApp: jest.fn().mockResolvedValue(true),
            createNotification: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register and return tokens', async () => {
      MockUserConstructor.findOne.mockResolvedValue(null);
      const dto = {
        name: 'Test',
        email: 'new@test.com',
        phone: '1234567890',
        password: 'password',
      };

      const result = await service.register(dto);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.message).toBe('Registration successful');
      expect(MockUserConstructor.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw ConflictException if user exists', async () => {
      MockUserConstructor.findOne.mockResolvedValue(mockUser);
      const dto = {
        name: 'Test',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password',
      };

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      MockUserConstructor.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        identifier: 'test@example.com',
        password: 'password',
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(MockUserConstructor.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      MockUserConstructor.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          identifier: 'test@example.com',
          password: 'wrong',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens if refresh token is valid', async () => {
      MockUserConstructor.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.refreshTokens('userId', 'validRefreshToken');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw ForbiddenException if tokens do not match', async () => {
      MockUserConstructor.findById.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.refreshTokens('userId', 'invalidRefreshToken'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('logout', () => {
    it('should call findByIdAndUpdate with null hash', async () => {
      await service.logout('userId');
      expect(MockUserConstructor.findByIdAndUpdate).toHaveBeenCalledWith(
        'userId',
        {
          refreshTokenHash: null,
        },
      );
    });
  });
});
