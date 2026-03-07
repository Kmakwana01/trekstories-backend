import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember, TeamMemberDocument } from '../../database/schemas/team-member.schema';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { FilterTeamMemberDto } from './dto/filter-team-member.dto';
import { paginate } from '../../common/helpers/pagination.helper';

@Injectable()
export class TeamMembersService {
    constructor(
        @InjectModel(TeamMember.name) private teamMemberModel: Model<TeamMemberDocument>,
    ) { }

    async create(createDto: CreateTeamMemberDto, imageUrl?: string): Promise<TeamMember> {
        const data: any = { ...createDto };
        if (imageUrl) data.image = imageUrl;

        // Handle socialLinks if passed as JSON string (multipart form)
        if (typeof data.socialLinks === 'string')
        {
            try { data.socialLinks = JSON.parse(data.socialLinks); }
            catch { data.socialLinks = {}; }
        }

        const member = new this.teamMemberModel(data);
        return member.save();
    }

    async findAllPublic() {
        return this.teamMemberModel
            .find({ isActive: true })
            .sort({ order: 1, createdAt: 1 })
            .lean()
            .exec();
    }

    async findAllAdmin(filters: FilterTeamMemberDto) {
        const { search, isActive, ...paginationQuery } = filters;
        const query: any = {};

        if (typeof isActive === 'boolean')
        {
            query.isActive = isActive;
        }

        if (search)
        {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { name: regex },
                { designation: regex },
                { bio: regex },
            ];
        }

        if (!paginationQuery.sort)
        {
            paginationQuery.sort = 'order';
            paginationQuery.order = 'asc';
        }

        return paginate<TeamMember>(this.teamMemberModel, query, paginationQuery);
    }

    async findOne(id: string): Promise<TeamMember> {
        const member = await this.teamMemberModel.findById(id).lean().exec();
        if (!member) throw new NotFoundException(`Team member with ID '${id}' not found`);
        return member;
    }

    async update(id: string, updateDto: UpdateTeamMemberDto, imageUrl?: string): Promise<TeamMember> {
        const member = await this.teamMemberModel.findById(id);
        if (!member) throw new NotFoundException(`Team member with ID '${id}' not found`);

        const updates: any = { ...updateDto };

        // Handle socialLinks if passed as JSON string (multipart form)
        if (typeof updates.socialLinks === 'string')
        {
            try { updates.socialLinks = JSON.parse(updates.socialLinks); }
            catch { delete updates.socialLinks; }
        }

        if (imageUrl) updates.image = imageUrl;

        Object.assign(member, updates);
        return member.save();
    }

    async remove(id: string): Promise<void> {
        const result = await this.teamMemberModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException(`Team member with ID '${id}' not found`);
    }

    async toggleActive(id: string): Promise<TeamMember> {
        const member = await this.teamMemberModel.findById(id);
        if (!member) throw new NotFoundException(`Team member with ID '${id}' not found`);
        member.isActive = !member.isActive;
        return member.save();
    }
}
