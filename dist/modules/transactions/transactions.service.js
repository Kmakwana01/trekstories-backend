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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("../../database/schemas/transaction.schema");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
let TransactionsService = class TransactionsService {
    transactionModel;
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    async createTransaction(dto) {
        const transaction = new this.transactionModel(dto);
        return transaction.save();
    }
    async getUserTransactions(userId) {
        return this.transactionModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .exec();
    }
    async getTransactionById(id, userId) {
        const query = { _id: id };
        if (userId)
            query.user = userId;
        return this.transactionModel.findOne(query).exec();
    }
    async getAllTransactions(filters = {}, paginationQuery = {}) {
        const query = { ...filters };
        return (0, pagination_helper_1.paginate)(this.transactionModel, query, paginationQuery, ['user']);
    }
    async exportToCSV(filters = {}) {
        const result = await this.getAllTransactions(filters, { limit: 1000 });
        const transactions = result.items;
        const header = 'Date,Transaction ID,User,Type,Amount,Status,Method,Description\n';
        const rows = transactions.map(t => {
            const userEmail = t.user?.email || 'Unknown';
            return `${t.createdAt.toISOString()},${t.transactionId},${userEmail},${t.type},${t.amount},${t.status},${t.paymentMethod},${t.description || ''}`;
        }).join('\n');
        return Buffer.from(header + rows);
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map