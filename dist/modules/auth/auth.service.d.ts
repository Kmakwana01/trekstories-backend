import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';
import { UserDocument } from '../../database/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    private notificationsService;
    private configService;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService, notificationsService: NotificationsService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
        message: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    adminLogin(loginDto: LoginDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(userId: string): Promise<any>;
    private getTokens;
    private updateRefreshTokenHash;
    private sanitizeUser;
    googleLogin(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        message: string;
        user: any;
    }>;
}
