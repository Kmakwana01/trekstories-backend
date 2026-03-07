"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ImgbbService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImgbbService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
let ImgbbService = ImgbbService_1 = class ImgbbService {
    configService;
    logger = new common_1.Logger(ImgbbService_1.name);
    apiKey;
    apiUrl = 'https://api.imgbb.com/1/upload';
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('imgbb.apiKey');
        if (!this.apiKey) {
            this.logger.warn('ImgBB API key is not configured. Image uploads will fail.');
        }
    }
    async uploadImage(file) {
        if (!this.apiKey) {
            throw new common_1.BadRequestException('ImgBB API key is not configured');
        }
        try {
            const formData = new form_data_1.default();
            formData.append('image', file.buffer, { filename: file.originalname });
            formData.append('key', this.apiKey);
            const response = await axios_1.default.post(this.apiUrl, formData, {
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
            throw new common_1.BadRequestException(`Failed to upload image: ${error.message}`);
        }
    }
    async uploadImages(files) {
        if (!files || files.length === 0)
            return [];
        const uploadPromises = files.map(file => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }
};
exports.ImgbbService = ImgbbService;
exports.ImgbbService = ImgbbService = ImgbbService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ImgbbService);
//# sourceMappingURL=imgbb.service.js.map