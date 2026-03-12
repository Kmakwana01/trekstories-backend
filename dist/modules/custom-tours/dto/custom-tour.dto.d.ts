import { CustomTourStatus } from '../schemas/custom-tour.schema';
export declare class CreateCustomTourDto {
    name: string;
    email: string;
    phone: string;
    destination: string;
    duration?: number;
    travelDate?: string;
    groupSize?: number;
    message?: string;
}
export declare class UpdateCustomTourDto {
    status?: CustomTourStatus;
    adminNotes?: string;
}
