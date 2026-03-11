import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { SettingsService } from '../../settings/settings.service';

@Processor('whatsapp')
export class WhatsAppProcessor {
    private readonly logger = new Logger(WhatsAppProcessor.name);

    constructor(private readonly settingsService: SettingsService) { }

    @Process('send-whatsapp')
    async handleSendWhatsApp(job: Job) {
        const { phone, message, template, context } = job.data;
        this.logger.log(`Processing WhatsApp job to: ${phone}`);

        try
        {
            const settings = await this.settingsService.getSettings();

            // Prefer settings from DB, fallback to env
            const isEnabled = settings.otherSettings?.whatsappEnabled;
            if (!isEnabled && process.env.WHATSAPP_PROVIDER !== 'meta')
            {
                this.logger.log(`[MOCK WHATSAPP] To: ${phone}, Message: ${message}, Template: ${template}`);
                return;
            }

            const phoneNumberId = settings.otherSettings?.whatsappPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;
            const token = settings.otherSettings?.whatsappAccessToken || process.env.WHATSAPP_ACCESS_TOKEN;
            const version = process.env.WHATSAPP_API_VERSION || 'v19.0';

            if (!phoneNumberId || !token)
            {
                this.logger.error('WhatsApp credentials missing (Phone Number ID or Access Token).');
                return;
            }

            // Ensure international phone formatting (Meta expects e.g., 919876543210 without +)
            const formattedPhone = phone.replace(/\+/g, '').replace(/\s/g, '');

            let payload: any = {
                messaging_product: 'whatsapp',
                to: formattedPhone,
            };

            // Check if template is provided, else fallback to simple text message if message is provided
            if (template)
            {
                payload.type = 'template';
                payload.template = {
                    name: template,
                    language: { code: 'en' },
                    components: context || []
                };
            } else if (message)
            {
                payload.type = 'text';
                payload.text = { body: message };
            }

            const url = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;

            await axios.post(url, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            this.logger.log(`Successfully sent WhatsApp message to ${phone}`);
        } catch (error: any)
        {
            this.logger.error(`Failed to send WhatsApp message to ${phone}: ${error.response?.data?.error?.message || error.message}`);
            // We do not rethrow to avoid crashing the job loop continuously for bad numbers
            // In a production app, we might handle retries or dead-letter queues.
        }
    }
}
