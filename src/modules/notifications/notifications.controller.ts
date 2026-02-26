import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    getNotifications(@CurrentUser('_id') userId: string, @Query() query: any) {
        return this.notificationsService.getNotifications(userId, query);
    }

    @Patch('read-all')
    markAllRead(@CurrentUser('_id') userId: string) {
        return this.notificationsService.markAllRead(userId);
    }

    @Patch(':id/read')
    markRead(@CurrentUser('_id') userId: string, @Param('id') id: string) {
        return this.notificationsService.markRead(userId, id);
    }

    @Get('unread-count')
    getUnreadCount(@CurrentUser('_id') userId: string) {
        return this.notificationsService.getUnreadCount(userId);
    }
}
