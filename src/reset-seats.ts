import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { getModelToken } from '@nestjs/mongoose';
import { TourDate } from './database/schemas/tour-date.schema';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('ResetTourSeats');
    const app = await NestFactory.createApplicationContext(SeedModule);
    const tourDateModel = app.get(getModelToken(TourDate.name));

    logger.log('Starting reset of totalSeats and bookedSeats for all TourDates...');

    const result = await tourDateModel.updateMany(
        {},
        {
            $set: {
                totalSeats: 25,
                bookedSeats: 0,
            },
        }
    );

    logger.log(`Successfully updated ${result.modifiedCount} TourDates. Total matched: ${result.matchedCount}`);
    logger.log('Reset complete.');

    await app.close();
    process.exit(0);
}

bootstrap();
