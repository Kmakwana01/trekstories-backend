import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { FilterTeamMemberDto } from './dto/filter-team-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/roles.enum';
import { AdminLogService } from '../admin/services/admin-log.service';
import type { UserDocument } from '../../database/schemas/user.schema';
import { ImageUploadService } from '../../common/services/image-upload.service';

const teamMemberMulter = {
  storage: memoryStorage(),
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
};

@Controller('admin/team-members')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminTeamMembersController {
  constructor(
    private readonly teamMembersService: TeamMembersService,
    private readonly adminLogService: AdminLogService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', teamMemberMulter))
  async create(
    @Body() createDto: CreateTeamMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserDocument,
    @Req() req: any,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.imageUploadService.uploadImage(file);
    }
    const member = await this.teamMembersService.create(createDto, imageUrl);
    await this.adminLogService.logAction(
      (user as any)._id.toString(),
      'CREATE_TEAM_MEMBER',
      'TeamMembers',
      (member as any)._id?.toString(),
      { name: createDto.name, designation: createDto.designation },
      req.ip,
      req.headers['user-agent'],
    );
    return member;
  }

  @Get()
  findAll(@Query() filterDto: FilterTeamMemberDto) {
    return this.teamMembersService.findAllAdmin(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMembersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', teamMemberMulter))
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTeamMemberDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserDocument,
    @Req() req: any,
  ) {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.imageUploadService.uploadImage(file);
    }
    const member = await this.teamMembersService.update(
      id,
      updateDto,
      imageUrl,
    );
    await this.adminLogService.logAction(
      (user as any)._id.toString(),
      'UPDATE_TEAM_MEMBER',
      'TeamMembers',
      id,
      { fields: Object.keys(updateDto) },
      req.ip,
      req.headers['user-agent'],
    );
    return member;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
    @Req() req: any,
  ) {
    await this.teamMembersService.remove(id);
    await this.adminLogService.logAction(
      (user as any)._id.toString(),
      'DELETE_TEAM_MEMBER',
      'TeamMembers',
      id,
      {},
      req.ip,
      req.headers['user-agent'],
    );
    return { message: 'Team member deleted successfully' };
  }

  @Patch(':id/toggle-active')
  async toggleActive(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
    @Req() req: any,
  ) {
    const member = await this.teamMembersService.toggleActive(id);
    await this.adminLogService.logAction(
      (user as any)._id.toString(),
      'TOGGLE_TEAM_MEMBER_ACTIVE',
      'TeamMembers',
      id,
      { isActive: (member as any).isActive },
      req.ip,
      req.headers['user-agent'],
    );
    return member;
  }
}
