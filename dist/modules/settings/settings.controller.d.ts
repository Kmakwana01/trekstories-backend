import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ImageUploadService } from '../../common/services/image-upload.service';
export declare class SettingsController {
    private readonly settingsService;
    private readonly imageUploadService;
    constructor(settingsService: SettingsService, imageUploadService: ImageUploadService);
    getSettings(): Promise<import("../../database/schemas/setting.schema").Setting>;
    getPolicies(): Promise<import("../../database/schemas/setting.schema").PolicyContent>;
    updateSettings(updateDto: UpdateSettingDto): Promise<import("../../database/schemas/setting.schema").Setting>;
    uploadQr(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadHero(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
