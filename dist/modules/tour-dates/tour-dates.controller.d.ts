import { TourDatesService } from './tour-dates.service';
import { CreateTourDateDto, UpdateTourDateDto } from './dto/create-tour-date.dto';
import { AdminLogService } from '../admin/services/admin-log.service';
export declare class TourDatesController {
    private readonly tourDatesService;
    constructor(tourDatesService: TourDatesService);
    getUpcomingDates(tourId: string): Promise<import("../../database/schemas/tour-date.schema").TourDate[]>;
}
export declare class AdminTourDatesController {
    private readonly tourDatesService;
    private readonly adminLogService;
    constructor(tourDatesService: TourDatesService, adminLogService: AdminLogService);
    getTourDates(tourId: string): Promise<import("../../database/schemas/tour-date.schema").TourDate[]>;
    createTourDate(createTourDateDto: CreateTourDateDto, adminId: string, req: any): Promise<import("../../database/schemas/tour-date.schema").TourDate>;
    updateTourDate(id: string, updateTourDateDto: UpdateTourDateDto, adminId: string, req: any): Promise<import("../../database/schemas/tour-date.schema").TourDate>;
    deleteTourDate(id: string, adminId: string, req: any): Promise<{
        message: string;
    }>;
    updateStatus(id: string, status: string, adminId: string, req: any): Promise<import("../../database/schemas/tour-date.schema").TourDate>;
    triggerAutoUpdate(): Promise<string>;
}
