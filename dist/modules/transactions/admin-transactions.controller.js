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
exports.AdminTransactionsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const transactions_service_1 = require("./transactions.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
let AdminTransactionsController = class AdminTransactionsController {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async getPendingReceipts(query) {
        return this.transactionsService.getAllTransactions({
            type: 'ONLINE_RECEIPT',
            status: 'PENDING'
        }, query);
    }
    async exportTransactions(res, filters) {
        const buffer = await this.transactionsService.exportToCSV(filters);
        res.set({
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=transactions.csv',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
    async getAllTransactions(query) {
        const { page, limit, sort, order, search, ...filters } = query;
        return this.transactionsService.getAllTransactions(filters, query);
    }
    async getAdminTransactionById(id) {
        const transaction = await this.transactionsService.getTransactionById(id);
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return transaction;
    }
    async approveReceipt(id, adminId) {
        return this.transactionsService.approvePayment(id, adminId);
    }
    async rejectReceipt(id, reason, adminId) {
        return this.transactionsService.rejectPayment(id, adminId, reason);
    }
    async recordOfflinePayment(adminId, dto) {
        return this.transactionsService.recordOfflinePayment(adminId, dto);
    }
};
exports.AdminTransactionsController = AdminTransactionsController;
__decorate([
    (0, common_1.Get)('pending-receipts'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTransactionsController.prototype, "getPendingReceipts", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminTransactionsController.prototype, "exportTransactions", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_helper_1.PaginationQuery]),
    __metadata("design:returntype", Promise)
], AdminTransactionsController.prototype, "getAllTransactions", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminTransactionsController.prototype, "getAdminTransactionById", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminTransactionsController.prototype, "approveReceipt", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminTransactionsController.prototype, "rejectReceipt", null);
__decorate([
    (0, common_1.Post)('offline'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminTransactionsController.prototype, "recordOfflinePayment", null);
exports.AdminTransactionsController = AdminTransactionsController = __decorate([
    (0, common_1.Controller)('admin/transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], AdminTransactionsController);
//# sourceMappingURL=admin-transactions.controller.js.map