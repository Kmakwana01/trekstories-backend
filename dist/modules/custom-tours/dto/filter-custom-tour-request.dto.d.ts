import { CustomTourStatus } from '../schemas/custom-tour-request.schema';
export declare class FilterCustomTourRequestDto {
    status?: CustomTourStatus;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class UpdateCustomTourStatusDto {
    status: CustomTourStatus;
    adminNotes?: string;
}
