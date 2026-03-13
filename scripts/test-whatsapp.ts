import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { NotificationsService } from '../src/modules/notifications/notifications.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const notificationsService = app.get(NotificationsService);

    const testPhone = '916355318232'; // <--- REPLACE THIS WITH YOUR REGISTERED TEST NUMBER
    const useTemplate = true; // Set to true for live testing with Meta (required for cold starts)

    if (useTemplate)
    {
        console.log(`🚀 Sending LIVE test WhatsApp using 'hello_world' template to ${testPhone}...`);

        console.log('--- Trial 1: en_US ---');
        try
        {
            await notificationsService.sendWhatsApp(testPhone, '', 'hello_world', [], 'en_US');
            console.log('✅ Trial 1 (en_US) enqueued!');
        } catch (error)
        {
            console.error('❌ Trial 1 Failed:', error.message);
        }

        console.log('--- Trial 2: en ---');
        try
        {
            await notificationsService.sendWhatsApp(testPhone, '', 'hello_world', [], 'en');
            console.log('✅ Trial 2 (en) enqueued!');
        } catch (error)
        {
            console.error('❌ Trial 2 Failed:', error.message);
        }
    } else
    // ... rest of the script
    {
        const testMessage = 'Hello from Antigravity! This is a test WhatsApp message.';
        console.log(`🚀 Sending test WhatsApp message to ${testPhone}...`);
        try
        {
            await notificationsService.sendWhatsApp(testPhone, testMessage);
            console.log('✅ Message enqueued successfully!');
        } catch (error)
        {
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
