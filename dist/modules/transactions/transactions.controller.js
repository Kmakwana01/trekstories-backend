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
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
let TransactionsController = class TransactionsController {
    transactionsService;
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
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
    (0, common_1.Get)('admin/transactions/export'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "exportTransactions", null);
__decorate([
    (0, common_1.Get)('admin/transactions'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_helper_1.PaginationQuery]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getAllTransactions", null);
__decorate([
    (0, common_1.Get)('admin/transactions/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getAdminTransactionById", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [transactions_service_1.TransactionsService])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map