import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../../database/schemas/transaction.schema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    ) { }

    async createTransaction(dto: Partial<Transaction>) {
        const transaction = new this.transactionModel(dto);
        return transaction.save();
    }

    async getUserTransactions(userId: string) {
        return this.transactionModel.find({ user: userId } as any)
            .sort({ createdAt: -1 })
            .exec();
    }

    async getTransactionById(id: string, userId?: string) {
        const query: any = { _id: id };
        if (userId) query.user = userId;
        return this.transactionModel.findOne(query).exec();
    }

    // Admin methods
    async getAllTransactions(filters: any = {}) {
        return this.transactionModel.find(filters)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .exec();
    }

    async exportToCSV(filters: any = {}): Promise<Buffer> {
        const transactions = await this.getAllTransactions(filters);
        const header = 'Date,Transaction ID,User,Type,Amount,Status,Method,Description\n';
        const rows = transactions.map(t => {
            const userEmail = (t.user as any)?.email || 'Unknown';
            return `${(t as any).createdAt.toISOString()},${t.transactionId},${userEmail},${t.type},${t.amount},${t.status},${t.paymentMethod},${t.description || ''}`;
        }).join('\n');

        return Buffer.from(header + rows);
    }
}
