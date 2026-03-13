
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SettingsService } from '../modules/settings/settings.service';

async function checkSettings() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const settingsService = app.get(SettingsService);
    const settings = await settingsService.getSettings();
    console.log('--- SETTINGS IN DB ---');
    console.log(JSON.stringify(settings, null, 2));
    await app.close();
}

checkSettings();
