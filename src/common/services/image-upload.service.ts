import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';
import * as crypto from 'crypto';

@Injectable()
export class ImageUploadService {
  private readonly logger = new Logger(ImageUploadService.name);

  // Cloudinary Config
  private provider: string; // 'cloudinary' | 'imgbb'
  private readonly cloudinaryCloudName: string | undefined;
  private readonly cloudinaryApiKey: string | undefined;
  private readonly cloudinaryApiSecret: string | undefined;

  // ImgBB Config
  private readonly imgbbApiKey: string | undefined;
  private readonly imgbbApiUrl = 'https://api.imgbb.com/1/upload';

  // ImageKit Config
  private readonly imagekitPublicKey: string | undefined;
  private readonly imagekitPrivateKey: string | undefined;
  private readonly imagekitUrlEndpoint: string | undefined;
  private readonly imagekitUploadUrl =
    'https://upload.imagekit.io/api/v1/files/upload';

  constructor(private configService: ConfigService) {
    this.provider = this.configService
      .get<string>('image.provider', 'cloudinary')
      .toLowerCase();

    this.cloudinaryCloudName = this.configService.get<string>(
      'image.cloudinary.cloudName',
    );
    this.cloudinaryApiKey = this.configService.get<string>(
      'image.cloudinary.apiKey',
    );
    this.cloudinaryApiSecret = this.configService.get<string>(
      'image.cloudinary.apiSecret',
    );

    this.imgbbApiKey = this.configService.get<string>('image.imgbb.apiKey');

    this.imagekitPublicKey = this.configService.get<string>(
      'image.imagekit.publicKey',
    );
    this.imagekitPrivateKey = this.configService.get<string>(
      'image.imagekit.privateKey',
    );
    this.imagekitUrlEndpoint = this.configService.get<string>(
      'image.imagekit.urlEndpoint',
    );

    if (
      this.provider === 'cloudinary' &&
      (!this.cloudinaryCloudName ||
        !this.cloudinaryApiKey ||
        !this.cloudinaryApiSecret)
    ) {
      this.logger.warn(
        'Cloudinary configuration is incomplete. Falling back to ImageKit if possible, then ImgBB.',
      );
      this.provider =
        this.imagekitPublicKey && this.imagekitPrivateKey
          ? 'imagekit'
          : 'imgbb';
    }

    if (
      this.provider === 'imagekit' &&
      (!this.imagekitPublicKey || !this.imagekitPrivateKey)
    ) {
      this.logger.warn(
        'ImageKit configuration is incomplete. Falling back to ImgBB.',
      );
      this.provider = 'imgbb';
    }

    if (this.provider === 'imgbb' && !this.imgbbApiKey) {
      this.logger.warn(
        'ImgBB API key is not configured. Image uploads will fail.',
      );
    }
  }

  /**
   * Uploads an image to the configured provider (Cloudinary or ImgBB)
   * @param file The Multer file object
   * @returns The URL of the uploaded image
   */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (this.provider === 'cloudinary') {
      return this.uploadToCloudinary(file);
    } else if (this.provider === 'imagekit') {
      return this.uploadToImageKit(file);
    } else {
      return this.uploadToImgbb(file);
    }
  }

  /**
   * Uploads multiple images
   * @param files Array of Multer file objects
   * @returns Array of uploaded image URLs
   */
  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  private async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      // String to sign must be alphabetized by parameter names.
      const stringToSign = `timestamp=${timestamp}${this.cloudinaryApiSecret}`;
      const signature = crypto
        .createHash('sha1')
        .update(stringToSign)
        .digest('hex');

      const formData = new FormData();
      formData.append('file', file.buffer, { filename: file.originalname });
      formData.append('api_key', this.cloudinaryApiKey!);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('resource_type', 'auto');

      const url = `https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/auto/upload`;

      const response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (response.data && response.data.secure_url) {
        return response.data.secure_url;
      }

      throw new Error('Invalid response from Cloudinary');
    } catch (error: any) {
      this.logger.error(
        `Cloudinary upload failed: ${error.response?.data?.error?.message || error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Failed to upload image to Cloudinary`);
    }
  }

  private async uploadToImgbb(file: Express.Multer.File): Promise<string> {
    if (!this.imgbbApiKey) {
      throw new BadRequestException('ImgBB API key is not configured');
    }

    try {
      const formData = new FormData();
      formData.append('image', file.buffer, { filename: file.originalname });
      formData.append('key', this.imgbbApiKey);

      const response = await axios.post(this.imgbbApiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (response.data && response.data.data && response.data.data.url) {
        return response.data.data.url;
      }

      throw new Error('Invalid response from ImgBB');
    } catch (error: any) {
      this.logger.error(`ImgBB upload failed: ${error.message}`, error.stack);
      throw new BadRequestException(
        `Failed to upload image to ImgBB: ${error.message}`,
      );
    }
  }

  private async uploadToImageKit(file: Express.Multer.File): Promise<string> {
    if (!this.imagekitPrivateKey) {
      throw new BadRequestException('ImageKit private key is not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', file.buffer, { filename: file.originalname });
      formData.append('fileName', file.originalname);
      formData.append('useUniqueFileName', 'true');

      // ImageKit uses Basic Auth with Private Key
      const authHeader = Buffer.from(`${this.imagekitPrivateKey}:`).toString(
        'base64',
      );

      const response = await axios.post(this.imagekitUploadUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Basic ${authHeader}`,
        },
      });

      if (response.data && response.data.url) {
        return response.data.url;
      }

      throw new Error('Invalid response from ImageKit');
    } catch (error: any) {
      this.logger.error(
        `ImageKit upload failed: ${error.response?.data?.message || error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Failed to upload to ImageKit: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}
