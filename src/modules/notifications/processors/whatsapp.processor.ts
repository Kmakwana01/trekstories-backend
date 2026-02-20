import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('whatsapp')
export class WhatsAppProcessor {
    private readonly logger = new Logger(WhatsAppProcessor.name);

    @Process('send-whatsapp')
    async handleSendWhatsApp(job: Job) {
        const { phone, message, template, context } = job.data;
        this.logger.log(`Processing WhatsApp job to: ${phone}`);

        // Since we don't have a real WhatsApp API integrated yet, we just log it.
        // In a real app, you'd call Twilio or another provider here.
        this.logger.log(`[MOCK WHATSAPP] To: ${phone}, Message: ${message}, Template: ${template}`);
    }
}
