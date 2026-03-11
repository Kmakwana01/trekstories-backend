import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import {
  Notification,
  NotificationDocument,
} from '../../database/schemas/notification.schema';
import { paginate } from '../../common/helpers/pagination.helper';
import { DateUtil } from '../../utils/date.util';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectQueue('email') private emailQueue: Queue,
    @InjectQueue('whatsapp') private whatsappQueue: Queue,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType | string,
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
    if (!query.order) query.order = 'desc';
    return paginate(this.notificationModel, { user: userId }, query);
  }

  async markRead(userId: string, id: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel
      .findOneAndUpdate(
        { _id: id, user: userId } as any,
        { isRead: true, readAt: DateUtil.nowUTC() },
        { returnDocument: 'after' },
      )
      .exec();

    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async markAllRead(userId: string) {
    await this.notificationModel
      .updateMany({ user: userId, isRead: false } as any, {
        isRead: true,
        readAt: DateUtil.nowUTC(),
      })
      .exec();
    return { success: true };
  }

  async getUnreadCount(userId: string) {
    const count = await this.notificationModel.countDocuments({
      user: userId,
      isRead: false,
    } as any);
    return { count };
  }

  async sendEmail(to: string, subject: string, template: string, context: any) {
    this.logger.log(`Enqueuing email to: ${to}`);
    // Enrich context: always provide year (used in template footer)
    // and ensure message is never undefined so Handlebars strict mode passes
    const enrichedContext = {
      year: DateUtil.nowUTC().getFullYear(),
      message: '',
      ...context,
    };
    await this.emailQueue.add('send-email', {
      to,
      subject,
      template,
      context: enrichedContext,
    });
  }

  async sendWhatsApp(
    phone: string,
    message: string,
    template?: string,
    context?: any,
  ) {
    this.logger.log(`Enqueuing WhatsApp to: ${phone}`);
    await this.whatsappQueue.add('send-whatsapp', {
      phone,
      message,
      template,
      context,
    });
  }
}
