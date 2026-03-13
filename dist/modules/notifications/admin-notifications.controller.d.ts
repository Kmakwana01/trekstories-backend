import { NotificationsService } from './notifications.service';
import { BulkEmailDto } from './dto/bulk-email.dto';
import { BulkWhatsAppDto } from './dto/bulk-whatsapp.dto';
export declare class AdminNotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendBulkEmail(dto: BulkEmailDto): Promise<{
        message: string;
    }>;
    sendBulkWhatsApp(dto: BulkWhatsAppDto): Promise<{
        message: string;
    }>;
    testWhatsApp(dto: {
        phone: string;
        message: string;
    }): Promise<{
        message: string;
    }>;
}
