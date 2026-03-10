import { ConfigService } from '@nestjs/config';
export declare class ImageUploadService {
    private configService;
    private readonly logger;
    private provider;
    private readonly cloudinaryCloudName;
    private readonly cloudinaryApiKey;
    private readonly cloudinaryApiSecret;
    private readonly imgbbApiKey;
    private readonly imgbbApiUrl;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<string>;
    uploadImages(files: Express.Multer.File[]): Promise<string[]>;
    private uploadToCloudinary;
    private uploadToImgbb;
}
