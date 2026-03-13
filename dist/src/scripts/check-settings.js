"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const settings_service_1 = require("../modules/settings/settings.service");
async function checkSettings() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const settingsService = app.get(settings_service_1.SettingsService);
    const settings = await settingsService.getSettings();
    console.log('--- SETTINGS IN DB ---');
    console.log(JSON.stringify(settings, null, 2));
    await app.close();
}
checkSettings();
//# sourceMappingURL=check-settings.js.map