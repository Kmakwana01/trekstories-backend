import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TourDatesService } from './tour-dates.service';
import { TourDate } from '../../database/schemas/tour-date.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TourDatesService', () => {
    let service: TourDatesService;
    let model: any;

    const mockTourDate = {
        _id: 'date123',
        tour: 'tour123',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-01-10'),
        totalSeats: 20,
        bookedSeats: 0,
        status: 'upcoming',
        save: jest.fn().mockResolvedValue({ _id: 'date123' }),
    };

    class MockTourDateModel {
        save: jest.Mock;
        constructor(public data: any) {
            Object.assign(this, data);
            this.save = jest.fn().mockResolvedValue({ ...this.data, _id: 'date123' });
        }
        static find = jest.fn();
        static findOneAndUpdate = jest.fn();
        static findOneAndDelete = jest.fn();
        static updateMany = jest.fn();
        static exec = jest.fn();
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TourDatesService,
                {
                    provide: getModelToken(TourDate.name),
                    useValue: MockTourDateModel,
                },
            ],
        }).compile();

        service = module.get<TourDatesService>(TourDatesService);
        model = module.get(getModelToken(TourDate.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('adminCreateTourDate', () => {
        it('should create a new tour date', async () => {
            const dto = {
                tour: 'tour123',
                startDate: '2026-01-01',
                endDate: '2026-01-10',
                totalSeats: 20,
            };

            const result = await service.adminCreateTourDate(dto as any);
            expect(result).toBeDefined();
            expect(result['_id']).toBe('date123');
        });

        it('should throw BadRequestException if startDate >= endDate', async () => {
            const dto = {
                tour: 'tour123',
                startDate: '2026-01-10',
                endDate: '2026-01-01',
                totalSeats: 20,
            };

            await expect(service.adminCreateTourDate(dto as any))
                .rejects.toThrow(BadRequestException);
        });
    });

    describe('getUpcomingDates', () => {
        it('should return upcoming dates for a tour', async () => {
            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockTourDate]),
            };
            model.find.mockReturnValue(mockFind);

            const result = await service.getUpcomingDates('tour123');
            expect(result).toHaveLength(1);
            expect(model.find).toHaveBeenCalledWith(expect.objectContaining({
                tour: 'tour123',
                status: 'upcoming'
            }));
        });
    });

    describe('updateStatus', () => {
        it('should update status and return tour date', async () => {
            model.findOneAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockTourDate),
            });

            const result = await service.updateStatus('date123', 'full');
            expect(result).toBeDefined();
            expect(model.findOneAndUpdate).toHaveBeenCalledWith(
                expect.objectContaining({ _id: 'date123' }),
                { status: 'full' },
                { new: true }
            );
        });

        it('should throw NotFoundException if date not found', async () => {
            model.findOneAndUpdate.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.updateStatus('wrongid', 'full'))
                .rejects.toThrow(NotFoundException);
        });
    });

    describe('adminDeleteTourDate', () => {
        it('should delete a tour date', async () => {
            model.findOneAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockTourDate),
            });

            await service.adminDeleteTourDate('date123');
            expect(model.findOneAndDelete).toHaveBeenCalledWith(
                expect.objectContaining({ _id: 'date123' })
            );
        });

        it('should throw NotFoundException if date not found', async () => {
            model.findOneAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            await expect(service.adminDeleteTourDate('wrongid'))
                .rejects.toThrow(NotFoundException);
        });
    });
});
