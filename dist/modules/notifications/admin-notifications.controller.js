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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const bulk_email_dto_1 = require("./dto/bulk-email.dto");
const bulk_whatsapp_dto_1 = require("./dto/bulk-whatsapp.dto");
const notification_type_enum_1 = require("../../common/enums/notification-type.enum");
let AdminNotificationsController = class AdminNotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async sendBulkEmail(dto) {
        for (const email of dto.emails) {
            const context = {
                message: dto.message,
                subject: dto.subject,
                ...(dto.templateData || {}),
            };
            await this.notificationsService.sendEmail(email, dto.subject, dto.templateName || notification_type_enum_1.NotificationType.GENERAL, context);
        }
        return { message: `Queued emails for ${dto.emails.length} users` };
    }
    async sendBulkWhatsApp(dto) {
        for (const phone of dto.phones) {
            await this.notificationsService.sendWhatsApp(phone, dto.message, dto.templateName, dto.templateData);
        }
        return { message: `Queued WhatsApp messages for ${dto.phones.length} users` };
    }
};
exports.AdminNotificationsController = AdminNotificationsController;
__decorate([
    (0, common_1.Post)('email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_email_dto_1.BulkEmailDto]),
    __metadata("design:returntype", Promise)
], AdminNotificationsController.prototype, "sendBulkEmail", null);
__decorate([
    (0, common_1.Post)('whatsapp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_whatsapp_dto_1.BulkWhatsAppDto]),
    __metadata("design:returntype", Promise)
], AdminNotificationsController.prototype, "sendBulkWhatsApp", null);
exports.AdminNotificationsController = AdminNotificationsController = __decorate([
    (0, common_1.Controller)('admin/notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], AdminNotificationsController);
//# sourceMappingURL=admin-notifications.controller.js.map