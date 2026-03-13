import type { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailProcessor {
    private readonly mailerService;
    private readonly logger;
    constructor(mailerService: MailerService);
    handleSendEmail(job: Job): Promise<void>;
}
