"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ImageUploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const crypto = __importStar(require("crypto"));
let ImageUploadService = ImageUploadService_1 = class ImageUploadService {
    configService;
    logger = new common_1.Logger(ImageUploadService_1.name);
    provider;
    cloudinaryCloudName;
    cloudinaryApiKey;
    cloudinaryApiSecret;
    imgbbApiKey;
    imgbbApiUrl = 'https://api.imgbb.com/1/upload';
    imagekitPublicKey;
    imagekitPrivateKey;
    imagekitUrlEndpoint;
    imagekitUploadUrl = 'https://upload.imagekit.io/api/v1/files/upload';
    constructor(configService) {
        this.configService = configService;
        this.provider = this.configService
            .get('image.provider', 'cloudinary')
            .toLowerCase();
        this.cloudinaryCloudName = this.configService.get('image.cloudinary.cloudName');
        this.cloudinaryApiKey = this.configService.get('image.cloudinary.apiKey');
        this.cloudinaryApiSecret = this.configService.get('image.cloudinary.apiSecret');
        this.imgbbApiKey = this.configService.get('image.imgbb.apiKey');
        this.imagekitPublicKey = this.configService.get('image.imagekit.publicKey');
        this.imagekitPrivateKey = this.configService.get('image.imagekit.privateKey');
        this.imagekitUrlEndpoint = this.configService.get('image.imagekit.urlEndpoint');
        if (this.provider === 'cloudinary' &&
            (!this.cloudinaryCloudName ||
                !this.cloudinaryApiKey ||
                !this.cloudinaryApiSecret)) {
            this.logger.warn('Cloudinary configuration is incomplete. Falling back to ImageKit if possible, then ImgBB.');
            this.provider =
                this.imagekitPublicKey && this.imagekitPrivateKey
                    ? 'imagekit'
                    : 'imgbb';
        }
        if (this.provider === 'imagekit' &&
            (!this.imagekitPublicKey || !this.imagekitPrivateKey)) {
            this.logger.warn('ImageKit configuration is incomplete. Falling back to ImgBB.');
            this.provider = 'imgbb';
        }
        if (this.provider === 'imgbb' && !this.imgbbApiKey) {
            this.logger.warn('ImgBB API key is not configured. Image uploads will fail.');
        }
    }
    async uploadImage(file) {
        if (this.provider === 'cloudinary') {
            return this.uploadToCloudinary(file);
        }
        else if (this.provider === 'imagekit') {
            return this.uploadToImageKit(file);
        }
        else {
            return this.uploadToImgbb(file);
        }
    }
    async uploadImages(files) {
        if (!files || files.length === 0)
            return [];
        const uploadPromises = files.map((file) => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }
    async uploadToCloudinary(file) {
        try {
            const timestamp = Math.floor(Date.now() / 1000).toString();
            const stringToSign = `timestamp=${timestamp}${this.cloudinaryApiSecret}`;
            const signature = crypto
                .createHash('sha1')
                .update(stringToSign)
                .digest('hex');
            const formData = new form_data_1.default();
            formData.append('file', file.buffer, { filename: file.originalname });
            formData.append('api_key', this.cloudinaryApiKey);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('resource_type', 'auto');
            const url = `https://api.cloudinary.com/v1_1/${this.cloudinaryCloudName}/auto/upload`;
            const response = await axios_1.default.post(url, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });
            if (response.data && response.data.secure_url) {
                return response.data.secure_url;
            }
            throw new Error('Invalid response from Cloudinary');
        }
        catch (error) {
            this.logger.error(`Cloudinary upload failed: ${error.response?.data?.error?.message || error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to upload image to Cloudinary`);
        }
    }
    async uploadToImgbb(file) {
        if (!this.imgbbApiKey) {
            throw new common_1.BadRequestException('ImgBB API key is not configured');
        }
        try {
            const formData = new form_data_1.default();
            formData.append('image', file.buffer, { filename: file.originalname });
            formData.append('key', this.imgbbApiKey);
            const response = await axios_1.default.post(this.imgbbApiUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });
            if (response.data && response.data.data && response.data.data.url) {
                return response.data.data.url;
            }
            throw new Error('Invalid response from ImgBB');
        }
        catch (error) {
            this.logger.error(`ImgBB upload failed: ${error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to upload image to ImgBB: ${error.message}`);
        }
    }
    async uploadToImageKit(file) {
        if (!this.imagekitPrivateKey) {
            throw new common_1.BadRequestException('ImageKit private key is not configured');
        }
        try {
            const formData = new form_data_1.default();
            formData.append('file', file.buffer, { filename: file.originalname });
            formData.append('fileName', file.originalname);
            formData.append('useUniqueFileName', 'true');
            const authHeader = Buffer.from(`${this.imagekitPrivateKey}:`).toString('base64');
            const response = await axios_1.default.post(this.imagekitUploadUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Basic ${authHeader}`,
                },
            });
            if (response.data && response.data.url) {
                return response.data.url;
            }
            throw new Error('Invalid response from ImageKit');
        }
        catch (error) {
            this.logger.error(`ImageKit upload failed: ${error.response?.data?.message || error.message}`, error.stack);
            throw new common_1.BadRequestException(`Failed to upload to ImageKit: ${error.response?.data?.message || error.message}`);
        }
    }
};
exports.ImageUploadService = ImageUploadService;
exports.ImageUploadService = ImageUploadService = ImageUploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ImageUploadService);
//# sourceMappingURL=image-upload.service.js.map