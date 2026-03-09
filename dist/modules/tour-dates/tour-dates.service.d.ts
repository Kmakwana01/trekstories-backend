import { Model } from 'mongoose';
import { TourDate, TourDateDocument } from '../../database/schemas/tour-date.schema';
import { CreateTourDateDto, UpdateTourDateDto } from './dto/create-tour-date.dto';
export declare class TourDatesService {
    private tourDateModel;
    constructor(tourDateModel: Model<TourDateDocument>);
    getUpcomingDates(tourId: string): Promise<TourDate[]>;
    getTourDatesWithSeats(tourId: string): Promise<any[]>;
    adminCreateTourDate(createTourDateDto: CreateTourDateDto): Promise<TourDate>;
    adminGetTourDates(tourId: string): Promise<TourDate[]>;
    adminUpdateTourDate(id: string, updateTourDateDto: UpdateTourDateDto): Promise<TourDate>;
    adminDeleteTourDate(id: string): Promise<void>;
    updateStatus(id: string, status: string): Promise<TourDate>;
    autoUpdateStatuses(): Promise<string>;
}
