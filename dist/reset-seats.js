"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const seed_module_1 = require("./seed.module");
const mongoose_1 = require("@nestjs/mongoose");
const tour_date_schema_1 = require("./database/schemas/tour-date.schema");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('ResetTourSeats');
    const app = await core_1.NestFactory.createApplicationContext(seed_module_1.SeedModule);
    const tourDateModel = app.get((0, mongoose_1.getModelToken)(tour_date_schema_1.TourDate.name));
    logger.log('Starting reset of totalSeats and bookedSeats for all TourDates...');
    const result = await tourDateModel.updateMany({}, {
        $set: {
            totalSeats: 25,
            bookedSeats: 0,
        },
    });
    logger.log(`Successfully updated ${result.modifiedCount} TourDates. Total matched: ${result.matchedCount}`);
    logger.log('Reset complete.');
    await app.close();
    process.exit(0);
}
bootstrap();
//# sourceMappingURL=reset-seats.js.map