import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Request() req) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Request() req, @Res() res: Response) {
        const result = await this.authService.googleLogin(req);

        // Redirect to frontend callback page with tokens in URL
        const frontendUrl = this.configService.get<string>('frontend.url') || 'https://www.trekstories.in';
        return res.redirect(`${frontendUrl}/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    async refresh(@Request() req) {
        return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@CurrentUser() user) {
        return this.authService.logout(user._id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@CurrentUser() user) {
        return this.authService.getMe(user._id);
    }
}
