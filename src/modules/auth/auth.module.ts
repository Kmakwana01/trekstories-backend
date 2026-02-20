import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from '../../database/schemas/user.schema';

import { AdminAuthController } from './admin-auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';

import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
                signOptions: {
                    expiresIn: configService.get<string>('jwt.expiresIn') as any,
                },
            }),
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        NotificationsModule,
    ],
    controllers: [AuthController, AdminAuthController],
    providers: [AuthService, JwtStrategy, GoogleStrategy, JwtRefreshStrategy],
    exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule { }
