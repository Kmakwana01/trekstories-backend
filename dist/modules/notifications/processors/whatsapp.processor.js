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
var WhatsAppProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
let WhatsAppProcessor = WhatsAppProcessor_1 = class WhatsAppProcessor {
    logger = new common_1.Logger(WhatsAppProcessor_1.name);
    async handleSendWhatsApp(job) {
        const { phone, message, template, context } = job.data;
        this.logger.log(`Processing WhatsApp job to: ${phone}`);
        this.logger.log(`[MOCK WHATSAPP] To: ${phone}, Message: ${message}, Template: ${template}`);
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
    (0, bull_1.Processor)('whatsapp')
], WhatsAppProcessor);
//# sourceMappingURL=whatsapp.processor.js.map