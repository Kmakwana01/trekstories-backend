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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminIpMiddleware = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("../../modules/settings/settings.service");
let AdminIpMiddleware = class AdminIpMiddleware {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async use(req, res, next) {
        const settings = await this.settingsService.getSettings();
        const whitelist = settings.adminIpWhitelist || [];
        if (whitelist.length > 0) {
            const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                req.ip ||
                req.socket.remoteAddress;
            const isWhitelisted = whitelist.some((ip) => {
                return ip.trim() === clientIp;
            });
            if (!isWhitelisted) {
                console.warn(`Blocked unauthorized admin access attempt from IP: ${clientIp}`);
                throw new common_1.ForbiddenException(`Your IP (${clientIp}) is not authorized to access the admin panel.`);
            }
        }
        next();
    }
};
exports.AdminIpMiddleware = AdminIpMiddleware;
exports.AdminIpMiddleware = AdminIpMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], AdminIpMiddleware);
//# sourceMappingURL=admin-ip.middleware.js.map