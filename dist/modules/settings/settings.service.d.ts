import { Model } from 'mongoose';
import { Setting, SettingDocument } from '../../database/schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsService {
    private settingModel;
    constructor(settingModel: Model<SettingDocument>);
    getSettings(): Promise<Setting>;
    updateSettings(updateDto: UpdateSettingDto): Promise<Setting>;
}
