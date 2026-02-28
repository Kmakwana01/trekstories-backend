import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../../../database/schemas/booking.schema';
import { Payment, PaymentDocument } from '../../../database/schemas/payment.schema';
import { Transaction, TransactionDocument } from '../../../database/schemas/transaction.schema';
import { createObjectCsvStringifier } from 'csv-writer';
const PDFDocument = require('pdfkit');


import { PassThrough } from 'stream';
import { DateUtil } from '../../../utils/date.util';

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    ) { }

    async generateRevenueCSV(startDate: Date, endDate: Date): Promise<string> {
        const transactions = await this.transactionModel
            .find({
                type: 'payment',
                status: 'success',
                createdAt: { $gte: startDate, $lte: endDate },
            })
            .populate('user', 'name email')
            .exec();

        const csvStringifier = createObjectCsvStringifier({

            header: [
                { id: 'date', title: 'DATE' },
                { id: 'transactionId', title: 'TRANSACTION ID' },
                { id: 'userName', title: 'USER' },
                { id: 'userEmail', title: 'EMAIL' },
                { id: 'amount', title: 'AMOUNT (INR)' },
                { id: 'paymentMethod', title: 'METHOD' },
            ],
        });

        const records = transactions.map((t: any) => ({
            date: DateUtil.formatToIST(t.createdAt, 'YYYY-MM-DD'),
            transactionId: t.transactionId,
            userName: (t.user as any)?.name || 'N/A',
            userEmail: (t.user as any)?.email || 'N/A',
            amount: t.amount,
            paymentMethod: t.paymentMethod,
        }));

        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    }

    async generateBookingCSV(startDate: Date, endDate: Date): Promise<string> {
        const bookings = await this.bookingModel
            .find({
                createdAt: { $gte: startDate, $lte: endDate },
            })
            .populate('user', 'name email')
            .populate('tour', 'title')
            .exec();

        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'date', title: 'DATE' },
                { id: 'bookingNumber', title: 'BOOKING #' },
                { id: 'customer', title: 'CUSTOMER' },
                { id: 'tour', title: 'TOUR' },
                { id: 'amount', title: 'TOTAL AMOUNT' },
                { id: 'status', title: 'STATUS' },
            ],
        });

        const records = bookings.map((b: any) => ({
            date: DateUtil.formatToIST(b.createdAt, 'YYYY-MM-DD'),
            bookingNumber: b.bookingNumber,
            customer: (b.user as any)?.name || 'N/A',
            tour: (b.tour as any)?.title || 'N/A',
            amount: b.totalAmount,
            status: b.status,
        }));

        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
    }

    async generateRevenuePDF(startDate: Date, endDate: Date): Promise<Buffer> {
        const transactions = await this.transactionModel
            .find({
                type: 'payment',
                status: 'success',
                createdAt: { $gte: startDate, $lte: endDate },
            })
            .populate('user', 'name email')
            .exec();

        const doc = new PDFDocument();
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));

        return new Promise((resolve, reject) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });

            doc.on('error', (err) => {
                reject(err);
            });


            doc.fontSize(20).text('Revenue Report', { align: 'center' });
            doc.fontSize(12).text(`Period: ${DateUtil.formatToIST(startDate)} to ${DateUtil.formatToIST(endDate)}`, { align: 'center' });
            doc.moveDown();

            doc.fontSize(14).text('Summary Table', { underline: true });
            doc.moveDown();

            transactions.forEach((t: any) => {
                doc.fontSize(10).text(
                    `${DateUtil.formatToIST(t.createdAt, 'YYYY-MM-DD')} | ${t.transactionId} | ${(t.user as any)?.name} | INR ${t.amount}`
                );
            });

            const total = transactions.reduce((sum, t) => sum + t.amount, 0);
            doc.moveDown();
            doc.fontSize(12).text(`Total Revenue: INR ${total}`, { bold: true });

            doc.end();
        });
    }
}
