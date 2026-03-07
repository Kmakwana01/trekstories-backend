import type { Job } from 'bull';
export declare class WhatsAppProcessor {
    private readonly logger;
    handleSendWhatsApp(job: Job): Promise<void>;
}
