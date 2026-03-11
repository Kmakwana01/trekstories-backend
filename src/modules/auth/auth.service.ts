import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Role } from '../../common/enums/roles.enum';
import { DateUtil } from '../../utils/date.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, phone, password } = registerDto;
    this.logger.log(`Attempting to register user: ${email}`);

    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      this.logger.warn(`Registration failed: User ${email} already exists`);
      throw new ConflictException('Email or phone already exists');
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

    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    return {
      message: 'Registration successful',
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;
    this.logger.log(`User login attempt: ${identifier}`);

    const user = await this.userModel.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      this.logger.warn(`Login failed: User ${identifier} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isBlocked) {
      this.logger.warn(`Login failed: User ${identifier} is blocked`);
      throw new ForbiddenException('Account is blocked');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      this.logger.warn(`Login failed: Invalid password for user ${identifier}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLogin = DateUtil.nowUTC();
    await user.save();
    this.logger.log(`User logged in successfully: ${identifier}`);

    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    return {
      message: 'Login successful',
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshTokenHash: null,
    });
    this.logger.log(`User logged out: ${userId}`);
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    this.logger.log(`Forgot password request for: ${email}`);
    const user = await this.userModel.findOne({ email });

    if (!user) {
      this.logger.warn(`Forgot password: User ${email} not found`);
      return { message: 'If account exists, reset email sent' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = DateUtil.nowIST().add(15, 'minute').utc().toDate(); // 15 mins expiry
    await user.save();

    await this.notificationsService.sendEmail(
      user.email,
      'Password Reset OTP',
      'otp',
      { otp, name: user.name },
    );

    this.logger.log(`Reset email sent to: ${email}`);
    return { message: 'If account exists, reset email sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetPasswordDto;
    this.logger.log(`Attempting password reset with OTP for: ${email}`);

    const user = await this.userModel.findOne({
      email,
      otp,
      otpExpiry: { $gt: DateUtil.nowUTC() },
    });

    if (!user) {
      this.logger.warn(`Password reset failed: Invalid or expired otp`);
      throw new BadRequestException('Invalid or expired otp');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    this.logger.log(`Password reset successful for user: ${user.email}`);
    return { message: 'Password updated successfully' };
  }

  async adminLogin(loginDto: LoginDto) {
    const { identifier, password } = loginDto;
    const user = await this.userModel.findOne({ email: identifier });

    if (!user || user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    return {
      ...tokens,
      user: this.sanitizeUser(user),
    };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }

  private async getTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret: this.configService.get<string>('jwt.secret'),
          expiresIn: (this.configService.get<string>('jwt.expiresIn') ||
            '15m') as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        {
          secret:
            this.configService.get<string>('jwt.refreshSecret') ||
            this.configService.get<string>('jwt.secret'),
          expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') ||
            '7d') as any,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(refreshToken, salt);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshTokenHash: hash,
    });
  }

  private sanitizeUser(user: UserDocument) {
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
      throw new BadRequestException('No user from google');
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
        role: Role.CUSTOMER,
      });

      await user.save();
    }

    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.role,
    );
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);

    return {
      message: 'User information from google',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }
}
