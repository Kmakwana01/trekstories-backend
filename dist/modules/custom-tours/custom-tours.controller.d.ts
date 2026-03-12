import { CustomToursService } from './custom-tours.service';
import { CreateCustomTourDto, UpdateCustomTourDto } from './dto/custom-tour.dto';
export declare class CustomToursController {
    private readonly customToursService;
    constructor(customToursService: CustomToursService);
    create(createCustomTourDto: CreateCustomTourDto): Promise<import("./schemas/custom-tour.schema").CustomTour>;
    findAll(query: any): Promise<{
        data: import("./schemas/custom-tour.schema").CustomTour[];
        meta: any;
    }>;
    findOne(id: string): Promise<import("./schemas/custom-tour.schema").CustomTour>;
    update(id: string, updateCustomTourDto: UpdateCustomTourDto): Promise<import("./schemas/custom-tour.schema").CustomTour>;
    remove(id: string): Promise<void>;
}
