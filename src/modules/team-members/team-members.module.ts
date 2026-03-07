import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { AdminTeamMembersController } from './admin-team-members.controller';
import { TeamMember, TeamMemberSchema } from '../../database/schemas/team-member.schema';
import { AdminModule } from '../admin/admin.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TeamMember.name, schema: TeamMemberSchema }]),
        AdminModule,
    ],
    controllers: [TeamMembersController, AdminTeamMembersController],
    providers: [TeamMembersService],
    exports: [TeamMembersService],
})
export class TeamMembersModule { }
