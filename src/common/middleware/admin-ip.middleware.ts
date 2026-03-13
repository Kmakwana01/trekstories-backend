import { Injectable, NestMiddleware, ForbiddenException, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../../modules/settings/settings.service';

@Injectable()
export class AdminIpMiddleware implements NestMiddleware {
  private readonly logger = new Logger('AdminIpGuard');

  constructor(private readonly settingsService: SettingsService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const isAdminRoute = req.originalUrl.includes('/admin/') ||
      (req.originalUrl.includes('/settings') && ['PUT', 'POST', 'PATCH'].includes(req.method));

    if (!isAdminRoute)
    {
      return next();
    }

    const settings = await this.settingsService.getSettings();
    const whitelist = settings.adminIpWhitelist || [];

    if (whitelist.length > 0)
    {
      let clientIp =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.ip ||
        req.socket.remoteAddress ||
        '0.0.0.0';

      // Handle IPv4-mapped-to-IPv6 (::ffff:127.0.0.1 -> 127.0.0.1)
      if (clientIp.startsWith('::ffff:'))
      {
        clientIp = clientIp.substring(7);
      }

      // Also handle localhost IPv6 address
      if (clientIp === '::1')
      {
        clientIp = '127.0.0.1';
      }

      this.logger.log(`Checking IP ${clientIp} for path ${req.originalUrl}`);

      const isWhitelisted = whitelist.some((ip) => {
        let normalizedIp = ip.trim();
        if (normalizedIp.startsWith('::ffff:'))
        {
          normalizedIp = normalizedIp.substring(7);
        }
        if (normalizedIp === '::1')
        {
          normalizedIp = '127.0.0.1';
        }
        return normalizedIp === clientIp;
      });

      if (!isWhitelisted)
      {
        this.logger.warn(
          `Blocked unauthorized admin access attempt from IP: ${clientIp} to ${req.method} ${req.originalUrl}`,
        );
        throw new ForbiddenException(
          `Your IP (${clientIp}) is not authorized to access the admin panel.`,
        );
      }
    }

    next();
  }
}
