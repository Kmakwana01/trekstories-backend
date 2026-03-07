"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const config_1 = require("@nestjs/config");
const notifications_service_1 = require("../notifications/notifications.service");
const user_schema_1 = require("../../database/schemas/user.schema");
const roles_enum_1 = require("../../common/enums/roles.enum");
const date_util_1 = require("../../utils/date.util");
let AuthService = AuthService_1 = class AuthService {
    userModel;
    jwtService;
    notificationsService;
    configService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userModel, jwtService, notificationsService, configService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.notificationsService = notificationsService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { email, phone, password } = registerDto;
        this.logger.log(`Attempting to register user: ${email}`);
        const existingUser = await this.userModel.findOne({
            $or: [{ email }, { phone }],
        });
        if (existingUser) {
            this.logger.warn(`Registration failed: User ${email} already exists`);
            throw new common_1.ConflictException('Email or phone already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = new this.userModel({
            ...registerDto,
            passwordHash,
            isVerified: true,
        });
        await user.save();
        this.logger.log(`User registered successfully: ${email} (${user._id})`);
        const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
        await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);
        return {
            message: 'Registration successful',
            ...tokens,
            user: this.sanitizeUser(user),
        };
    }
    async login(loginDto) {
        const { identifier, password } = loginDto;
        this.logger.log(`User login attempt: ${identifier}`);
        const user = await this.userModel.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
        });
        if (!user) {
            this.logger.warn(`Login failed: User ${identifier} not found`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.isBlocked) {
            this.logger.warn(`Login failed: User ${identifier} is blocked`);
            throw new common_1.ForbiddenException('Account is blocked');
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            this.logger.warn(`Login failed: Invalid password for user ${identifier}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        user.lastLogin = date_util_1.DateUtil.nowUTC();
        await user.save();
        this.logger.log(`User logged in successfully: ${identifier}`);
        const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
        await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);
        return {
            message: 'Login successful',
            ...tokens,
            user: this.sanitizeUser(user),
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userModel.findById(userId);
        if (!user || !user.refreshTokenHash) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!refreshTokenMatches) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
        await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);
        return tokens;
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            refreshTokenHash: null,
        });
        this.logger.log(`User logged out: ${userId}`);
        return { message: 'Logged out successfully' };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        this.logger.log(`Forgot password request for: ${email}`);
        const user = await this.userModel.findOne({ email });
        if (!user) {
            this.logger.warn(`Forgot password: User ${email} not found`);
            return { message: 'If account exists, reset email sent' };
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = date_util_1.DateUtil.nowIST().add(15, 'minute').utc().toDate();
        await user.save();
        await this.notificationsService.sendEmail(user.email, 'Password Reset OTP', 'otp', { otp, name: user.name });
        this.logger.log(`Reset email sent to: ${email}`);
        return { message: 'If account exists, reset email sent' };
    }
    async resetPassword(resetPasswordDto) {
        const { email, otp, newPassword } = resetPasswordDto;
        this.logger.log(`Attempting password reset with OTP for: ${email}`);
        const user = await this.userModel.findOne({
            email,
            otp,
            otpExpiry: { $gt: date_util_1.DateUtil.nowUTC() },
        });
        if (!user) {
            this.logger.warn(`Password reset failed: Invalid or expired otp`);
            throw new common_1.BadRequestException('Invalid or expired otp');
        }
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        this.logger.log(`Password reset successful for user: ${user.email}`);
        return { message: 'Password updated successfully' };
    }
    async adminLogin(loginDto) {
        const { identifier, password } = loginDto;
        const user = await this.userModel.findOne({ email: identifier });
        if (!user || user.role !== roles_enum_1.Role.ADMIN) {
            throw new common_1.UnauthorizedException('Invalid admin credentials');
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid admin credentials');
        }
        const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
        await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);
        return {
            ...tokens,
            user: this.sanitizeUser(user),
        };
    }
    async getMe(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async getTokens(userId, email, role) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, role }, {
                secret: this.configService.get('jwt.secret'),
                expiresIn: (this.configService.get('jwt.expiresIn') || '15m'),
            }),
            this.jwtService.signAsync({ sub: userId, email, role }, {
                secret: this.configService.get('jwt.refreshSecret') || this.configService.get('jwt.secret'),
                expiresIn: (this.configService.get('jwt.refreshExpiresIn') || '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async updateRefreshTokenHash(userId, refreshToken) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(refreshToken, salt);
        await this.userModel.findByIdAndUpdate(userId, {
            refreshTokenHash: hash,
        });
    }
    sanitizeUser(user) {
        const obj = user.toObject();
        delete obj.passwordHash;
        delete obj.refreshTokenHash;
        delete obj.otp;
        delete obj.otpExpiry;
        delete obj.resetToken;
        delete obj.resetTokenExpiry;
        return obj;
    }
    async googleLogin(req) {
        if (!req.user) {
            throw new common_1.BadRequestException('No user from google');
        }
        const { email, firstName, lastName } = req.user;
        let user = await this.userModel.findOne({ email });
        if (!user) {
            const password = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            user = new this.userModel({
                name: `${firstName} ${lastName}`,
                email,
                passwordHash,
                isVerified: true,
                role: roles_enum_1.Role.CUSTOMER,
            });
            await user.save();
        }
        const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
        await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);
        return {
            message: 'User information from google',
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        notifications_service_1.NotificationsService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map