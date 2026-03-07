import { ConfigService } from '@nestjs/config';
export declare class ImgbbService {
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<string>;
    uploadImages(files: Express.Multer.File[]): Promise<string[]>;
}
