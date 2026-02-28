import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from '../../database/schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    ) { }

    async getSettings(): Promise<Setting> {
        let settings = await this.settingModel.findOne({ isGlobal: true }).exec();
        if (!settings)
        {
            settings = await this.settingModel.create({ isGlobal: true });
        }
        return settings;
    }

    async updateSettings(updateDto: UpdateSettingDto): Promise<Setting> {
        const updatedSettings = await this.settingModel.findOneAndUpdate(
            { isGlobal: true },
            { $set: updateDto },
            { new: true, upsert: true }
        ).exec();

        return updatedSettings;
    }
}
