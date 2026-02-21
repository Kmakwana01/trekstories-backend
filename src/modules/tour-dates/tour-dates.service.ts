import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TourDate, TourDateDocument } from '../../database/schemas/tour-date.schema';
import { CreateTourDateDto, UpdateTourDateDto } from './dto/create-tour-date.dto';

@Injectable()
export class TourDatesService {
    constructor(
        @InjectModel(TourDate.name) private tourDateModel: Model<TourDateDocument>
    ) { }

    async getUpcomingDates(tourId: string): Promise<TourDate[]> {
        const query: any = {
            tour: tourId,
            status: 'upcoming',
            startDate: { $gt: new Date() }
        };
        return this.tourDateModel.find(query).sort({ startDate: 1 }).exec();
    }

    async adminCreateTourDate(createTourDateDto: CreateTourDateDto): Promise<TourDate> {
        const { startDate, endDate } = createTourDateDto;

        if (new Date(startDate) >= new Date(endDate))
        {
            throw new BadRequestException('Start date must be before end date');
        }

        const newDate = new this.tourDateModel(createTourDateDto);
        return newDate.save();
    }

    async adminGetTourDates(tourId: string): Promise<TourDate[]> {
        const query: any = { tour: tourId };
        return this.tourDateModel.find(query).sort({ startDate: 1 }).exec();
    }

    async adminUpdateTourDate(id: string, updateTourDateDto: UpdateTourDateDto): Promise<TourDate> {
        const updatedDate = await this.tourDateModel.findByIdAndUpdate(
            id,
            updateTourDateDto,
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
        const today = new Date();

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
