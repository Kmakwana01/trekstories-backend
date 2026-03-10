import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<import("../../database/schemas/setting.schema").Setting>;
    getPolicies(): Promise<import("../../database/schemas/setting.schema").PolicyContent>;
    updateSettings(updateDto: UpdateSettingDto): Promise<import("../../database/schemas/setting.schema").Setting>;
    uploadQr(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
