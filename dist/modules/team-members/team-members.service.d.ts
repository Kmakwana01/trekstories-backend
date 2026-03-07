import { Model } from 'mongoose';
import { TeamMember, TeamMemberDocument } from '../../database/schemas/team-member.schema';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { FilterTeamMemberDto } from './dto/filter-team-member.dto';
export declare class TeamMembersService {
    private teamMemberModel;
    constructor(teamMemberModel: Model<TeamMemberDocument>);
    create(createDto: CreateTeamMemberDto, imageUrl?: string): Promise<TeamMember>;
    findAllPublic(): Promise<(TeamMember & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findAllAdmin(filters: FilterTeamMemberDto): Promise<import("../../common/helpers/pagination.helper").PaginationResult<TeamMember>>;
    findOne(id: string): Promise<TeamMember>;
    update(id: string, updateDto: UpdateTeamMemberDto, imageUrl?: string): Promise<TeamMember>;
    remove(id: string): Promise<void>;
    toggleActive(id: string): Promise<TeamMember>;
}
