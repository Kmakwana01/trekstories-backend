import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return (
            request?.body?.refreshToken ||
            request?.headers?.authorization?.replace('Bearer ', '')
          );
        },
      ]),
      secretOrKey:
        configService.get<string>('jwt.refreshSecret') ||
        configService.get<string>('jwt.secret') ||
        'default_secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken =
      req.body?.refreshToken ||
      req.headers?.authorization?.replace('Bearer ', '');
    return { ...payload, refreshToken };
  }
}
