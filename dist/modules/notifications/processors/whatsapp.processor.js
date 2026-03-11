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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WhatsAppProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const settings_service_1 = require("../../settings/settings.service");
let WhatsAppProcessor = WhatsAppProcessor_1 = class WhatsAppProcessor {
    settingsService;
    logger = new common_1.Logger(WhatsAppProcessor_1.name);
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async handleSendWhatsApp(job) {
        const { phone, message, template, context } = job.data;
        this.logger.log(`Processing WhatsApp job to: ${phone}`);
        try {
            const settings = await this.settingsService.getSettings();
            const isEnabled = settings.otherSettings?.whatsappEnabled;
            if (!isEnabled && process.env.WHATSAPP_PROVIDER !== 'meta') {
                this.logger.log(`[MOCK WHATSAPP] To: ${phone}, Message: ${message}, Template: ${template}`);
                return;
            }
            const phoneNumberId = settings.otherSettings?.whatsappPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;
            const token = settings.otherSettings?.whatsappAccessToken || process.env.WHATSAPP_ACCESS_TOKEN;
            const version = process.env.WHATSAPP_API_VERSION || 'v19.0';
            if (!phoneNumberId || !token) {
                this.logger.error('WhatsApp credentials missing (Phone Number ID or Access Token).');
                return;
            }
            const formattedPhone = phone.replace(/\+/g, '').replace(/\s/g, '');
            let payload = {
                messaging_product: 'whatsapp',
                to: formattedPhone,
            };
            if (template) {
                payload.type = 'template';
                payload.template = {
                    name: template,
                    language: { code: 'en' },
                    components: context || []
                };
            }
            else if (message) {
                payload.type = 'text';
                payload.text = { body: message };
            }
            const url = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;
            await axios_1.default.post(url, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            this.logger.log(`Successfully sent WhatsApp message to ${phone}`);
        }
        catch (error) {
            this.logger.error(`Failed to send WhatsApp message to ${phone}: ${error.response?.data?.error?.message || error.message}`);
        }
    }
};
exports.WhatsAppProcessor = WhatsAppProcessor;
__decorate([
    (0, bull_1.Process)('send-whatsapp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsAppProcessor.prototype, "handleSendWhatsApp", null);
exports.WhatsAppProcessor = WhatsAppProcessor = WhatsAppProcessor_1 = __decorate([
    (0, bull_1.Processor)('whatsapp'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], WhatsAppProcessor);
//# sourceMappingURL=whatsapp.processor.js.map