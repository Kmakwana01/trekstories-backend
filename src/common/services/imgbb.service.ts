import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class ImgbbService {
    private readonly logger = new Logger(ImgbbService.name);
    private readonly apiKey: string | undefined;
    private readonly apiUrl = 'https://api.imgbb.com/1/upload';

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get<string>('imgbb.apiKey');
        if (!this.apiKey)
        {
            this.logger.warn('ImgBB API key is not configured. Image uploads will fail.');
        }
    }

    /**
     * Uploads an image to ImgBB
     * @param file The Multer file object
     * @returns The URL of the uploaded image
     */
    async uploadImage(file: Express.Multer.File): Promise<string> {
        if (!this.apiKey)
        {
            throw new BadRequestException('ImgBB API key is not configured');
        }

        try
        {
            const formData = new FormData();
            formData.append('image', file.buffer, { filename: file.originalname });
            formData.append('key', this.apiKey);

            const response = await axios.post(this.apiUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });

            if (response.data && response.data.data && response.data.data.url)
            {
                return response.data.data.url;
            }

            throw new Error('Invalid response from ImgBB');
        } catch (error)
        {
            this.logger.error(`ImgBB upload failed: ${error.message}`, error.stack);
            throw new BadRequestException(`Failed to upload image: ${error.message}`);
        }
    }

    /**
     * Uploads multiple images to ImgBB
     * @param files Array of Multer file objects
     * @returns Array of uploaded image URLs
     */
    async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
        if (!files || files.length === 0) return [];

        const uploadPromises = files.map(file => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }
}
