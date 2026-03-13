import { CustomToursService } from './custom-tours.service';
import { CreateCustomTourRequestDto } from './dto/create-custom-tour-request.dto';
export declare class CustomToursController {
    private readonly service;
    constructor(service: CustomToursService);
    submitRequest(dto: CreateCustomTourRequestDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: import("mongoose").Types.ObjectId;
        };
    }>;
}
