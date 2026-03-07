import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { FilterTeamMemberDto } from './dto/filter-team-member.dto';
import { AdminLogService } from '../admin/services/admin-log.service';
import type { UserDocument } from '../../database/schemas/user.schema';
import { ImgbbService } from '../../common/services/imgbb.service';
export declare class AdminTeamMembersController {
    private readonly teamMembersService;
    private readonly adminLogService;
    private readonly imgbbService;
    constructor(teamMembersService: TeamMembersService, adminLogService: AdminLogService, imgbbService: ImgbbService);
    create(createDto: CreateTeamMemberDto, file: Express.Multer.File, user: UserDocument, req: any): Promise<import("../../database/schemas/team-member.schema").TeamMember>;
    findAll(filterDto: FilterTeamMemberDto): Promise<import("../../common/helpers/pagination.helper").PaginationResult<import("../../database/schemas/team-member.schema").TeamMember>>;
    findOne(id: string): Promise<import("../../database/schemas/team-member.schema").TeamMember>;
    update(id: string, updateDto: UpdateTeamMemberDto, file: Express.Multer.File, user: UserDocument, req: any): Promise<import("../../database/schemas/team-member.schema").TeamMember>;
    remove(id: string, user: UserDocument, req: any): Promise<{
        message: string;
    }>;
    toggleActive(id: string, user: UserDocument, req: any): Promise<import("../../database/schemas/team-member.schema").TeamMember>;
}
