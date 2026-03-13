import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AdminAuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(user: any): Promise<any>;
}
