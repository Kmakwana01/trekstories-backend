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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const image_upload_service_1 = require("../../common/services/image-upload.service");
const receiptMulter = {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
            return cb(new Error('Only image and pdf files are allowed'), false);
        }
        cb(null, true);
    },
};
let TransactionsController = class TransactionsController {
    transactionsService;
    imageUploadService;
    constructor(transactionsService, imageUploadService) {
        this.transactionsService = transactionsService;
        this.imageUploadService = imageUploadService;
    }
    async getMyTransactions(userId) {
        return this.transactionsService.getUserTransactions(userId);
    }
    async getTransactionById(id, userId) {
        const transaction = await this.transactionsService.getTransactionById(id, userId);
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async submitPaymentProof(userId, file, dto) {
        if (!file) {
            throw new common_1.BadRequestException('Receipt image is required');
        }
        if (!dto.bookingId || !dto.transactionId) {
            throw new common_1.BadRequestException('Booking ID and Transaction ID are required');
        }
        const receiptImageUrl = await this.imageUploadService.uploadImage(file);
        return this.transactionsService.submitPaymentProof(userId, {
            bookingId: dto.bookingId,
            transactionId: dto.transactionId,
            paymentMethod: dto.paymentMethod,
            paymentAmount: dto.paymentAmount ? Number(dto.paymentAmount) : undefined,
            receiptImage: receiptImageUrl
        });
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Get)('transactions/my'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getMyTransactions", null);
__decorate([
    (0, common_1.Get)('transactions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getTransactionById", null);
__decorate([
    (0, common_1.Post)('transactions/submit-proof'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('receiptImage', receiptMulter)),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "submitPaymentProof", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService,
        image_upload_service_1.ImageUploadService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map