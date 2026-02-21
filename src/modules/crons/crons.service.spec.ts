import { Test, TestingModule } from '@nestjs/testing';
import { CronsService } from './crons.service';
import { TourDatesService } from '../tour-dates/tour-dates.service';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReportsService } from '../admin/services/reports.service';

describe('CronsService', () => {
  let service: CronsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronsService,
        { provide: TourDatesService, useValue: {} },
        { provide: BookingsService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: ReportsService, useValue: {} },
      ],
    }).compile();

    service = module.get<CronsService>(CronsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
