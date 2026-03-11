import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    googleLogin: jest.fn(),
    getMe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call service.register', async () => {
      const dto = {
        name: 'Test',
        email: 'test@test.com',
        phone: '123',
        password: 'pass',
        gender: 'male',
        country: 'India',
        contactAddress: 'Address',
      };
      await controller.register(dto as any);
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call service.login', async () => {
      const dto = { identifier: 'test@test.com', password: 'pass' };
      await controller.login(dto);
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('refresh', () => {
    it('should call service.refreshTokens', async () => {
      const req = { user: { sub: 'userId', refreshToken: 'token' } };
      await controller.refresh(req);
      expect(service.refreshTokens).toHaveBeenCalledWith('userId', 'token');
    });
  });

  describe('logout', () => {
    it('should call service.logout', async () => {
      const user = { _id: 'userId' };
      await controller.logout(user as any);
      expect(service.logout).toHaveBeenCalledWith('userId');
    });
  });
});
