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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../../../database/schemas/booking.schema");
const payment_schema_1 = require("../../../database/schemas/payment.schema");
const transaction_schema_1 = require("../../../database/schemas/transaction.schema");
const csv_writer_1 = require("csv-writer");
const PDFDocument = require('pdfkit');
const date_util_1 = require("../../../utils/date.util");
const transaction_enum_1 = require("../../../common/enums/transaction.enum");
let ReportsService = class ReportsService {
    bookingModel;
    paymentModel;
    transactionModel;
    constructor(bookingModel, paymentModel, transactionModel) {
        this.bookingModel = bookingModel;
        this.paymentModel = paymentModel;
        this.transactionModel = transactionModel;
    }
    async generateRevenueCSV(startDate, endDate) {
        const transactions = await this.transactionModel
            .find({
            type: transaction_enum_1.TransactionType.PAYMENT,
            status: transaction_enum_1.TransactionStatus.SUCCESS,
            createdAt: { $gte: startDate, $lte: endDate },
        })
            .populate('user', 'name email')
            .exec();
        const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({
            header: [
                { id: 'date', title: 'DATE' },
                { id: 'transactionId', title: 'TRANSACTION ID' },
                { id: 'userName', title: 'USER' },
                { id: 'userEmail', title: 'EMAIL' },
                { id: 'amount', title: 'AMOUNT (INR)' },
                { id: 'paymentMethod', title: 'METHOD' },
            ],
        });
        const records = transactions.map((t) => ({
            date: date_util_1.DateUtil.formatToIST(t.createdAt, 'YYYY-MM-DD'),
            transactionId: t.transactionId,
            userName: t.user?.name || 'N/A',
            userEmail: t.user?.email || 'N/A',
            amount: t.amount,
            paymentMethod: t.paymentMethod,
        }));
        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    }
    async generateBookingCSV(startDate, endDate) {
        const bookings = await this.bookingModel
            .find({
            createdAt: { $gte: startDate, $lte: endDate },
        })
            .populate('user', 'name email')
            .populate('tour', 'title')
            .exec();
        const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({
            header: [
                { id: 'date', title: 'DATE' },
                { id: 'bookingNumber', title: 'BOOKING #' },
                { id: 'customer', title: 'CUSTOMER' },
                { id: 'tour', title: 'TOUR' },
                { id: 'amount', title: 'TOTAL AMOUNT' },
                { id: 'status', title: 'STATUS' },
            ],
        });
        const records = bookings.map((b) => ({
            date: date_util_1.DateUtil.formatToIST(b.createdAt, 'YYYY-MM-DD'),
            bookingNumber: b.bookingNumber,
            customer: b.user?.name || 'N/A',
            tour: b.tour?.title || 'N/A',
            amount: b.totalAmount,
            status: b.status,
        }));
        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    }
    async generateRevenuePDF(startDate, endDate) {
        const transactions = await this.transactionModel
            .find({
            type: transaction_enum_1.TransactionType.PAYMENT,
            status: transaction_enum_1.TransactionStatus.SUCCESS,
            createdAt: { $gte: startDate, $lte: endDate },
        })
            .populate('user', 'name email')
            .exec();
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        return new Promise((resolve, reject) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
            doc.on('error', (err) => {
                reject(err);
            });
            doc.fontSize(20).text('Revenue Report', { align: 'center' });
            doc.fontSize(12).text(`Period: ${date_util_1.DateUtil.formatToIST(startDate)} to ${date_util_1.DateUtil.formatToIST(endDate)}`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text('Summary Table', { underline: true });
            doc.moveDown();
            transactions.forEach((t) => {
                doc.fontSize(10).text(`${date_util_1.DateUtil.formatToIST(t.createdAt, 'YYYY-MM-DD')} | ${t.transactionId} | ${t.user?.name} | INR ${t.amount}`);
            });
            const total = transactions.reduce((sum, t) => sum + t.amount, 0);
            doc.moveDown();
            doc.fontSize(12).text(`Total Revenue: INR ${total}`, { bold: true });
            doc.end();
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(2, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map