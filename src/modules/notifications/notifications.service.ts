import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Notification, NotificationDocument } from '../../database/schemas/notification.schema';
import { paginate } from '../../common/helpers/pagination.helper';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
        @InjectQueue('email') private emailQueue: Queue,
        @InjectQueue('whatsapp') private whatsappQueue: Queue,
    ) { }

    async createNotification(
        userId: string,
        type: string,
        title: string,
        message: string,
        metadata?: any,
    ): Promise<NotificationDocument> {
        const notification = new this.notificationModel({
            user: userId,
            type,
            title,
            message,
            metadata,
        });
        return notification.save();
    }

    async getNotifications(userId: string, query: any) {
        return paginate(this.notificationModel, { user: userId }, query);
    }

    async markRead(userId: string, id: string): Promise<NotificationDocument> {
        const notification = await this.notificationModel.findOneAndUpdate(
            { _id: id, user: userId } as any,
            { isRead: true, readAt: new Date() },
            { returnDocument: 'after' },
        ).exec();

        if (!notification) throw new NotFoundException('Notification not found');
        return notification;
    }

    async markAllRead(userId: string) {
        await this.notificationModel.updateMany(
            { user: userId, isRead: false } as any,
            { isRead: true, readAt: new Date() },
        ).exec();
        return { success: true };
    }

    async sendEmail(to: string, subject: string, template: string, context: any) {
        this.logger.log(`Enqueuing email to: ${to}`);
        await this.emailQueue.add('send-email', {
            to,
            subject,
            template,
            context,
        });
    }

    async sendWhatsApp(phone: string, message: string, template?: string, context?: any) {
        this.logger.log(`Enqueuing WhatsApp to: ${phone}`);
        await this.whatsappQueue.add('send-whatsapp', {
            phone,
            message,
            template,
            context,
        });
    }
}
