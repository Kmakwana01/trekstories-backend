import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { BulkEmailDto } from './dto/bulk-email.dto';
import { BulkWhatsAppDto } from './dto/bulk-whatsapp.dto';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Controller('admin/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminNotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('email')
  async sendBulkEmail(@Body() dto: BulkEmailDto) {
    for (const email of dto.emails) {
      // Always merge dto.message into templateData so {{message}} is available
      // in the general.hbs template even when custom templateData is supplied
      const context = {
        message: dto.message,
        subject: dto.subject,
        ...(dto.templateData || {}),
      };
      await this.notificationsService.sendEmail(
        email,
        dto.subject,
        dto.templateName || NotificationType.GENERAL,
        context,
      );
    }
    return { message: `Queued emails for ${dto.emails.length} users` };
  }

  @Post('whatsapp')
  async sendBulkWhatsApp(@Body() dto: BulkWhatsAppDto) {
    for (const phone of dto.phones) {
      await this.notificationsService.sendWhatsApp(
        phone,
        dto.message,
        dto.templateName,
        dto.templateData,
      );
    }
    return {
      message: `Queued WhatsApp messages for ${dto.phones.length} users`,
    };
  }
}
