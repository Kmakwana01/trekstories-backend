import { ReportsService } from '../services/reports.service';
import type { Response } from 'express';
export declare class AdminReportsController {
    private reportsService;
    constructor(reportsService: ReportsService);
    getRevenueCSV(startDate: string, endDate: string, res: Response): Promise<void>;
    getRevenuePDF(startDate: string, endDate: string, res: Response): Promise<void>;
    getBookingCSV(startDate: string, endDate: string, res: Response): Promise<void>;
}
