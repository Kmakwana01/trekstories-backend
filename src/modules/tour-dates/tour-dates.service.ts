import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TourDate, TourDateDocument } from '../../database/schemas/tour-date.schema';
import { CreateTourDateDto, UpdateTourDateDto } from './dto/create-tour-date.dto';
import { DateUtil } from '../../utils/date.util';

@Injectable()
export class TourDatesService {
    constructor(
        @InjectModel(TourDate.name) private tourDateModel: Model<TourDateDocument>
    ) { }

    async getUpcomingDates(tourId: string): Promise<TourDate[]> {
        const query: any = {
            tour: tourId,
            status: 'upcoming',
            startDate: { $gt: DateUtil.startOfDayIST(DateUtil.nowIST().toDate()) }
        };
        return this.tourDateModel.find(query).sort({ startDate: 1 }).exec();
    }

    async adminCreateTourDate(createTourDateDto: CreateTourDateDto): Promise<TourDate> {
        const { startDate, endDate } = createTourDateDto;

        if (DateUtil.parseISTToUTC(startDate) >= DateUtil.parseISTToUTC(endDate))
        {
            throw new BadRequestException('Start date must be before end date');
        }

        const newDate = new this.tourDateModel({
            ...createTourDateDto,
            startDate: DateUtil.parseISTToUTC(startDate),
            endDate: DateUtil.parseISTToUTC(endDate)
        });
        return newDate.save();
    }

    async adminGetTourDates(tourId: string): Promise<TourDate[]> {
        const query: any = { tour: tourId };
        return this.tourDateModel.find(query).sort({ startDate: 1 }).exec();
    }

    async adminUpdateTourDate(id: string, updateTourDateDto: UpdateTourDateDto): Promise<TourDate> {
        const updateData: any = { ...updateTourDateDto };
        if (updateData.startDate) updateData.startDate = DateUtil.parseISTToUTC(updateData.startDate);
        if (updateData.endDate) updateData.endDate = DateUtil.parseISTToUTC(updateData.endDate);

        const updatedDate = await this.tourDateModel.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after' }
        ).exec();

        if (!updatedDate)
        {
            throw new NotFoundException(`Tour date with ID ${id} not found`);
        }
        return updatedDate;
    }

    async adminDeleteTourDate(id: string): Promise<void> {
        const query: any = { _id: id };
        const result = await this.tourDateModel.findOneAndDelete(query).exec();
        if (!result)
        {
            throw new NotFoundException(`Tour date with ID ${id} not found`);
        }
    }

    async updateStatus(id: string, status: string): Promise<TourDate> {
        const query: any = { _id: id };
        const updatedDate = await this.tourDateModel.findOneAndUpdate(
            query,
            { status },
            { returnDocument: 'after' }
        ).exec();

        if (!updatedDate)
        {
            throw new NotFoundException(`Tour date with ID ${id} not found`);
        }
        return updatedDate;
    }

    async autoUpdateStatuses(): Promise<string> {
        const today = DateUtil.startOfDayIST(DateUtil.nowIST().toDate());

        // Mark completed
        const completedResult = await this.tourDateModel.updateMany(
            {
                status: 'upcoming',
                endDate: { $lt: today }
            },
            { status: 'completed' }
        );

        // Mark full (virtual availableSeats is not available in query, so we use totalSeats - bookedSeats)
        const fullResult = await this.tourDateModel.updateMany(
            {
                status: 'upcoming',
                $expr: { $lte: ['$totalSeats', '$bookedSeats'] }
            },
            { status: 'full' }
        );

        return `Updated ${completedResult.modifiedCount} to completed and ${fullResult.modifiedCount} to full.`;
    }
}
