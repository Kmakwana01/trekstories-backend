import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../../modules/settings/settings.service';

@Injectable()
export class AdminIpMiddleware implements NestMiddleware {
  constructor(private readonly settingsService: SettingsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const settings = await this.settingsService.getSettings();
    const whitelist = settings.adminIpWhitelist || [];

    if (whitelist.length > 0) {
      const clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.ip ||
        req.socket.remoteAddress;

      const isWhitelisted = whitelist.some((ip) => {
        // Simple string match or basic IP comparison
        return ip.trim() === clientIp;
      });

      if (!isWhitelisted) {
        console.warn(
          `Blocked unauthorized admin access attempt from IP: ${clientIp}`,
        );
        throw new ForbiddenException(
          `Your IP (${clientIp}) is not authorized to access the admin panel.`,
        );
      }
    }

    next();
  }
}
