import type { Job } from 'bull';
import { SettingsService } from '../../settings/settings.service';
export declare class WhatsAppProcessor {
    private readonly settingsService;
    private readonly logger;
    constructor(settingsService: SettingsService);
    handleSendWhatsApp(job: Job): Promise<void>;
}
