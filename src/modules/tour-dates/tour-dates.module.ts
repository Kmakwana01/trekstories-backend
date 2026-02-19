import { Module } from '@nestjs/common';
import { TourDatesService } from './tour-dates.service';
import { TourDatesController, AdminTourDatesController } from './tour-dates.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [TourDatesService],
    controllers: [TourDatesController, AdminTourDatesController],
    exports: [TourDatesService],
})
export class TourDatesModule { }
