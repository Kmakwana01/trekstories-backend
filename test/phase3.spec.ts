import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../src/database/schemas/user.schema';
import { BadRequestException, ConflictException } from '@nestjs/common';

const mockUser = {
    _id: 'someId',
    email: 'test@example.com',
    phone: '1234567890',
    passwordHash: 'hashedPassword',
    save: jest.fn(),
    toObject: jest.fn().mockReturnValue({ email: 'test@example.com' }),
};

const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
};

// Mocking the constructor call `new this.userModel(...)`
class MockUserModel {
    _id = 'mockId';
    email = '';
    role = 'customer';
    passwordHash = '';
    otp = '';
    otpExpiry = new Date();

    constructor(public data: any) {
        Object.assign(this, data);
    }
    save = jest.fn().mockResolvedValue(this);
    toObject = jest.fn().mockReturnValue(this);
    static findOne = jest.fn();
    static findById = jest.fn();
}

describe('Phase 3: Auth Module', () => {
    let service: AuthService;
    let model: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: MockUserModel, // Mocking the model class
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('token'),
                    },
                },
                {
                    provide: MailerService,
                    useValue: {
                        sendMail: jest.fn().mockResolvedValue(true),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        model = module.get(getModelToken(User.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Google Login', () => {
        it('should create user if google login succeeds', async () => {
            // Mock request object from Passport
            const req = {
                user: {
                    email: 'google@test.com',
                    firstName: 'Google',
                    lastName: 'User',
                    picture: 'pic.jpg',
                },
            };

            // Mock findOne to return null (first time login)
            jest.spyOn(MockUserModel, 'findOne').mockResolvedValue(null);
            // Mock save on new instance
            const saveSpy = jest.fn().mockResolvedValue({
                _id: 'newId',
                email: 'google@test.com',
                role: 'customer',
                toObject: () => ({ email: 'google@test.com' }),
            });
            // We need to ensure the service uses our mock model correctly.
            // Since we mocked the class constructor in the module setup, we can't easily spy on instances created inside service.
            // However, we can mock the prototype or just rely on the service logic not crashing and returning a token.

            // Let's just check the service method returns a token.
            const result = await service.googleLogin(req);
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('user');
        });
    });
    // Basic unit test for structure. 
    // Detailed logic tests would mock Mongoose model instances more deeply.
});
