import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    CustomTourRequest,
    CustomTourRequestDocument,
} from './schemas/custom-tour-request.schema';
import { CreateCustomTourRequestDto } from './dto/create-custom-tour-request.dto';
import { FilterCustomTourRequestDto, UpdateCustomTourStatusDto } from './dto/filter-custom-tour-request.dto';

@Injectable()
export class CustomToursService {
    constructor(
        @InjectModel(CustomTourRequest.name)
        private readonly model: Model<CustomTourRequestDocument>,
    ) { }

    async create(dto: CreateCustomTourRequestDto) {
        const doc = await this.model.create(dto);
        return doc;
    }

    async findAll(filter: FilterCustomTourRequestDto) {
        const { status, search, page = 1, limit = 15 } = filter;
        const query: Record<string, any> = {};

        if (status) query.status = status;
        if (search)
        {
            const re = new RegExp(search, 'i');
            query.$or = [{ name: re }, { email: re }, { phone: re }, { destination: re }];
        }

        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            this.model.countDocuments(query),
        ]);

        return {
            items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        const doc = await this.model.findById(id).lean();
        if (!doc) throw new NotFoundException('Custom tour request not found');
        return doc;
    }

    async updateStatus(id: string, dto: UpdateCustomTourStatusDto) {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { status: dto.status, ...(dto.adminNotes !== undefined && { adminNotes: dto.adminNotes }) },
            { new: true },
        ).lean();
        if (!doc) throw new NotFoundException('Custom tour request not found');
        return doc;
    }

    async getStats() {
        const [total, newCount, contacted, closed] = await Promise.all([
            this.model.countDocuments(),
            this.model.countDocuments({ status: 'NEW' }),
            this.model.countDocuments({ status: 'CONTACTED' }),
            this.model.countDocuments({ status: 'CLOSED' }),
        ]);
        return { total, new: newCount, contacted, closed };
    }
}
