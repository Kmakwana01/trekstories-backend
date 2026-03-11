import { Model } from 'mongoose';
import { BookingDocument } from '../../../database/schemas/booking.schema';
import { TransactionDocument } from '../../../database/schemas/transaction.schema';
export declare class ReportsService {
    private bookingModel;
    private transactionModel;
    constructor(bookingModel: Model<BookingDocument>, transactionModel: Model<TransactionDocument>);
    generateRevenueCSV(startDate: Date, endDate: Date): Promise<string>;
    generateBookingCSV(startDate: Date, endDate: Date): Promise<string>;
    generateRevenuePDF(startDate: Date, endDate: Date): Promise<Buffer>;
}
