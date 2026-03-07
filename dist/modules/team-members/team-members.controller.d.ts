import { TeamMembersService } from './team-members.service';
export declare class TeamMembersController {
    private readonly teamMembersService;
    constructor(teamMembersService: TeamMembersService);
    findAll(): Promise<(import("../../database/schemas/team-member.schema").TeamMember & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("../../database/schemas/team-member.schema").TeamMember>;
}
