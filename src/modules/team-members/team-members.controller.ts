import { Controller, Get, Param, Query } from '@nestjs/common';
import { TeamMembersService } from './team-members.service';
import { FilterTeamMemberDto } from './dto/filter-team-member.dto';

@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Get()
  findAll() {
    return this.teamMembersService.findAllPublic();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }
}
