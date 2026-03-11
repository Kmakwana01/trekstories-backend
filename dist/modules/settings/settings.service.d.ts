import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { Setting, SettingDocument } from '../../database/schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsService {
    private settingModel;
    private cacheManager;
    constructor(settingModel: Model<SettingDocument>, cacheManager: Cache);
    getSettings(): Promise<Setting>;
    updateSettings(updateDto: UpdateSettingDto): Promise<Setting>;
}
