import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../database/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.secret') || 'secret',
        });
    }

    async validate(payload: any) {
        // payload: { sub: userId, email, role }
        const user = await this.userModel.findById(payload.sub).exec();

        if (!user)
        {
            throw new UnauthorizedException('User not found');
        }

        if (user.isBlocked)
        {
            throw new UnauthorizedException('User is blocked');
        }

        // Return the user object, attached to request.user
        return user;
    }
}
