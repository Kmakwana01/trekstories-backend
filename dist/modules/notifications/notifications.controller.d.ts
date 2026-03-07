import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(userId: string, query: any): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    markAllRead(userId: string): Promise<{
        success: boolean;
    }>;
    markRead(userId: string, id: string): Promise<import("../../database/schemas/notification.schema").NotificationDocument>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
}
