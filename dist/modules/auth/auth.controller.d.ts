import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
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
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    refresh(req: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: any): Promise<{
        message: string;
    }>;
    getMe(user: any): Promise<any>;
}
