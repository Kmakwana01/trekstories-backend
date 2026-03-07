import { Model } from 'mongoose';
import type { Queue } from 'bull';
import { NotificationDocument } from '../../database/schemas/notification.schema';
import { NotificationType } from '../../common/enums/notification-type.enum';
export declare class NotificationsService {
    private notificationModel;
    private emailQueue;
    private whatsappQueue;
    private readonly logger;
    constructor(notificationModel: Model<NotificationDocument>, emailQueue: Queue, whatsappQueue: Queue);
    createNotification(userId: string, type: NotificationType | string, title: string, message: string, metadata?: any): Promise<NotificationDocument>;
    getNotifications(userId: string, query: any): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    markRead(userId: string, id: string): Promise<NotificationDocument>;
    markAllRead(userId: string): Promise<{
        success: boolean;
    }>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    sendEmail(to: string, subject: string, template: string, context: any): Promise<void>;
    sendWhatsApp(phone: string, message: string, template?: string, context?: any): Promise<void>;
}
