import { Module } from '@nestjs/common';
import { TourDatesService } from './tour-dates.service';
import {
  TourDatesController,
  AdminTourDatesController,
} from './tour-dates.controller';
import { DatabaseModule } from '../../database/database.module';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [DatabaseModule, AdminModule],
  providers: [TourDatesService],
  controllers: [TourDatesController, AdminTourDatesController],
  exports: [TourDatesService],
})
export class TourDatesModule {}
