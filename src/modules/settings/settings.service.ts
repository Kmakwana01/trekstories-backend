import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import {
  Setting,
  SettingDocument,
} from '../../database/schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    const updatedSettings = await this.settingModel
      .findOneAndUpdate(
        { isGlobal: true },
        { $set: updateDto },
        { returnDocument: 'after', upsert: true },
      )
      .exec();

    // Invalidate home data cache to ensure sliders and other settings reflect immediately
    await this.cacheManager.del('home_data_payload');

    return updatedSettings;
  }
}
