import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';

@Processor('email')
export class EmailProcessor {
    private readonly logger = new Logger(EmailProcessor.name);

    constructor(private readonly mailerService: MailerService) { }

    @Process('send-email')
    async handleSendEmail(job: Job) {
        const { to, subject, template, context } = job.data;
        this.logger.log(`Processing email job to: ${to}`);

        try
        {
            await this.mailerService.sendMail({
                to,
                subject,
                template,
                context,
            });
            this.logger.log(`Email sent successfully to: ${to}`);
        } catch (error)
        {
            this.logger.error(`Failed to send email to: ${to}`, error.stack);
            throw error;
        }
    }
}
