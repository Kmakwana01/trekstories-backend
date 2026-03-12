import { Model } from 'mongoose';
import { CustomTour, CustomTourDocument } from './schemas/custom-tour.schema';
import { CreateCustomTourDto, UpdateCustomTourDto } from './dto/custom-tour.dto';
export declare class CustomToursService {
    private customTourModel;
    constructor(customTourModel: Model<CustomTourDocument>);
    create(createCustomTourDto: CreateCustomTourDto): Promise<CustomTour>;
    findAll(query?: any): Promise<{
        data: CustomTour[];
        meta: any;
    }>;
    findOne(id: string): Promise<CustomTour>;
    update(id: string, updateCustomTourDto: UpdateCustomTourDto): Promise<CustomTour>;
    remove(id: string): Promise<void>;
}
