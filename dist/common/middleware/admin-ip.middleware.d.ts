import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../../modules/settings/settings.service';
export declare class AdminIpMiddleware implements NestMiddleware {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
