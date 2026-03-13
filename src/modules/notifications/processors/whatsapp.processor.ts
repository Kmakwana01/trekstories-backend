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
    const { phone, message, template, context, language } = job.data;
    this.logger.log(`Processing WhatsApp job to: ${phone}`);

    try
    {
      const settings = await this.settingsService.getSettings();

      // Prefer settings from DB, fallback to env
      const isEnabled = settings.otherSettings?.whatsappEnabled;
      if (!isEnabled && process.env.WHATSAPP_PROVIDER !== 'meta')
      {
        this.logger.log(
          `[MOCK WHATSAPP] To: ${phone}, Message: ${message}, Template: ${template}`,
        );
        return;
      }

      const phoneNumberId =
        settings.otherSettings?.whatsappPhoneNumberId ||
        process.env.WHATSAPP_PHONE_NUMBER_ID;
      const token =
        settings.otherSettings?.whatsappAccessToken ||
        process.env.WHATSAPP_ACCESS_TOKEN;
      const version = process.env.WHATSAPP_API_VERSION || 'v22.0';

      if (!phoneNumberId || !token)
      {
        this.logger.error(
          'WhatsApp credentials missing (Phone Number ID or Access Token).',
        );
        return;
      }

      // Ensure international phone formatting (Meta expects e.g., 919876543210 without +)
      const formattedPhone = phone.replace(/\+/g, '').replace(/\s/g, '');

      const payload: any = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
      };

      // Check if template is provided, else fallback to simple text message if message is provided
      if (template)
      {
        payload.type = 'template';
        payload.template = {
          name: template,
          language: { code: language || 'en_US' },
        };
        // Only add components if there is actual context provided
        if (context && context.length > 0)
        {
          payload.template.components = context;
        }
      } else if (message)
      {
        payload.type = 'text';
        payload.text = { body: message };
      }

      const url = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;

      this.logger.log(`Sending WhatsApp to ${url} with payload: ${JSON.stringify(payload)}`);

      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.logger.log(`Successfully sent WhatsApp message to ${phone}`);
    } catch (error: any)
    {
      const errorData = error.response?.data;
      this.logger.error(
        `Failed to send WhatsApp message to ${phone}: ${JSON.stringify(errorData || error.message)}`,
      );
    }
  }
}
