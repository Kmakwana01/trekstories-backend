"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bull_1 = require("@nestjs/bull");
const notification_schema_1 = require("../../database/schemas/notification.schema");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
const date_util_1 = require("../../utils/date.util");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    notificationModel;
    emailQueue;
    whatsappQueue;
    logger = new common_1.Logger(NotificationsService_1.name);
    constructor(notificationModel, emailQueue, whatsappQueue) {
        this.notificationModel = notificationModel;
        this.emailQueue = emailQueue;
        this.whatsappQueue = whatsappQueue;
    }
    async createNotification(userId, type, title, message, metadata) {
        const notification = new this.notificationModel({
            user: userId,
            type,
            title,
            message,
            metadata,
        });
        return notification.save();
    }
    async getNotifications(userId, query) {
        return (0, pagination_helper_1.paginate)(this.notificationModel, { user: userId }, query);
    }
    async markRead(userId, id) {
        const notification = await this.notificationModel.findOneAndUpdate({ _id: id, user: userId }, { isRead: true, readAt: date_util_1.DateUtil.nowUTC() }, { returnDocument: 'after' }).exec();
        if (!notification)
            throw new common_1.NotFoundException('Notification not found');
        return notification;
    }
    async markAllRead(userId) {
        await this.notificationModel.updateMany({ user: userId, isRead: false }, { isRead: true, readAt: date_util_1.DateUtil.nowUTC() }).exec();
        return { success: true };
    }
    async getUnreadCount(userId) {
        const count = await this.notificationModel.countDocuments({ user: userId, isRead: false });
        return { count };
    }
    async sendEmail(to, subject, template, context) {
        this.logger.log(`Enqueuing email to: ${to}`);
        const enrichedContext = {
            year: date_util_1.DateUtil.nowUTC().getFullYear(),
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
    async sendWhatsApp(phone, message, template, context) {
        this.logger.log(`Enqueuing WhatsApp to: ${phone}`);
        await this.whatsappQueue.add('send-whatsapp', {
            phone,
            message,
            template,
            context,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.Notification.name)),
    __param(1, (0, bull_1.InjectQueue)('email')),
    __param(2, (0, bull_1.InjectQueue)('whatsapp')),
    __metadata("design:paramtypes", [mongoose_2.Model, Object, Object])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map