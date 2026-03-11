import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || 0;
      const timeMs = Date.now() - startTime;

      if (statusCode >= 500) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} [${timeMs}ms]`,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} [${timeMs}ms]`,
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} [${timeMs}ms]`,
        );
      }
    });

    next();
  }
}
