import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { AdminNotificationsController } from './admin-notifications.controller';
import { Notification, NotificationSchema } from '../../database/schemas/notification.schema';
import { EmailProcessor } from './processors/email.processor';
import { WhatsAppProcessor } from './processors/whatsapp.processor';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
        BullModule.registerQueue(
            { name: 'email' },
            { name: 'whatsapp' },
        ),
    ],
    providers: [NotificationsService, EmailProcessor, WhatsAppProcessor],
    controllers: [NotificationsController, AdminNotificationsController],
    exports: [NotificationsService],
})
export class NotificationsModule { }
