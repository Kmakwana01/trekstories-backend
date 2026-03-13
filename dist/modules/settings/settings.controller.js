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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const settings_service_1 = require("./settings.service");
const update_setting_dto_1 = require("./dto/update-setting.dto");
const image_upload_service_1 = require("../../common/services/image-upload.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const swagger_1 = require("@nestjs/swagger");
let SettingsController = class SettingsController {
    settingsService;
    imageUploadService;
    constructor(settingsService, imageUploadService) {
        this.settingsService = settingsService;
        this.imageUploadService = imageUploadService;
    }
    async getAdminSettings() {
        return this.settingsService.getSettings();
    }
    async getSettings() {
        const settings = await this.settingsService.getSettings();
        const settingsObj = settings.toObject ? settings.toObject() : JSON.parse(JSON.stringify(settings));
        if (settingsObj.otherSettings) {
            delete settingsObj.otherSettings.whatsappAccessToken;
            delete settingsObj.otherSettings.whatsappPhoneNumberId;
        }
        delete settingsObj.adminIpWhitelist;
        return settingsObj;
    }
    async getPolicies() {
        const settings = await this.settingsService.getSettings();
        return settings.policies || {};
    }
    async updateSettings(updateDto) {
        return this.settingsService.updateSettings(updateDto);
    }
    async uploadQr(file) {
        const url = await this.imageUploadService.uploadImage(file);
        return { url };
    }
    async uploadHero(file) {
        const url = await this.imageUploadService.uploadImage(file);
        return { url };
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get full settings data (Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getAdminSettings", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get global website settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return settings data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Get)('policies'),
    (0, swagger_1.ApiOperation)({ summary: 'Get privacy and booking policy content' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns policy text content' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getPolicies", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update global website settings (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings successfully updated' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_setting_dto_1.UpdateSettingDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Post)('upload-qr'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload UPI QR code image' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "uploadQr", null);
__decorate([
    (0, common_1.Post)('upload-hero'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Upload Hero Slider banner image' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "uploadHero", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('Settings'),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        image_upload_service_1.ImageUploadService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map