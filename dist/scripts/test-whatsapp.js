"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const notifications_service_1 = require("../src/modules/notifications/notifications.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const notificationsService = app.get(notifications_service_1.NotificationsService);
    const testPhone = '916355318232';
    const useTemplate = true;
    if (useTemplate) {
        console.log(`🚀 Sending LIVE test WhatsApp using 'hello_world' template to ${testPhone}...`);
        console.log('--- Trial 1: en_US ---');
        try {
            await notificationsService.sendWhatsApp(testPhone, '', 'hello_world', [], 'en_US');
            console.log('✅ Trial 1 (en_US) enqueued!');
        }
        catch (error) {
            console.error('❌ Trial 1 Failed:', error.message);
        }
        console.log('--- Trial 2: en ---');
        try {
            await notificationsService.sendWhatsApp(testPhone, '', 'hello_world', [], 'en');
            console.log('✅ Trial 2 (en) enqueued!');
        }
        catch (error) {
            console.error('❌ Trial 2 Failed:', error.message);
        }
    }
    else {
        const testMessage = 'Hello from Antigravity! This is a test WhatsApp message.';
        console.log(`🚀 Sending test WhatsApp message to ${testPhone}...`);
        try {
            await notificationsService.sendWhatsApp(testPhone, testMessage);
            console.log('✅ Message enqueued successfully!');
        }
        catch (error) {
            console.error('❌ Failed:', error.message);
        }
    }
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Ensure "Enable WhatsApp Notifications" is ON in Admin Panel.');
    console.log('2. Check the backend terminal logs.');
    console.log('3. If using Meta, check your phone for the message.');
    await app.close();
}
bootstrap();
//# sourceMappingURL=test-whatsapp.js.map