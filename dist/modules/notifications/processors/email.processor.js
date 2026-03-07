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
var EmailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
let EmailProcessor = EmailProcessor_1 = class EmailProcessor {
    mailerService;
    logger = new common_1.Logger(EmailProcessor_1.name);
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async handleSendEmail(job) {
        const { to, subject, template, context } = job.data;
        this.logger.log(`Processing email job to: ${to}`);
        try {
            await this.mailerService.sendMail({
                to,
                subject,
                template,
                context,
            });
            this.logger.log(`Email sent successfully to: ${to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to: ${to}`, error.stack);
            throw error;
        }
    }
};
exports.EmailProcessor = EmailProcessor;
__decorate([
    (0, bull_1.Process)('send-email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailProcessor.prototype, "handleSendEmail", null);
exports.EmailProcessor = EmailProcessor = EmailProcessor_1 = __decorate([
    (0, bull_1.Processor)('email'),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailProcessor);
//# sourceMappingURL=email.processor.js.map