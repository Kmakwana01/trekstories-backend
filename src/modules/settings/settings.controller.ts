import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ImageUploadService } from '../../common/services/image-upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly imageUploadService: ImageUploadService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get global website settings' })
  @ApiResponse({ status: 200, description: 'Return settings data' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Get('policies')
  @ApiOperation({ summary: 'Get privacy and booking policy content' })
  @ApiResponse({ status: 200, description: 'Returns policy text content' })
  async getPolicies() {
    const settings = await this.settingsService.getSettings();
    return settings.policies || {};
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update global website settings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Settings successfully updated' })
  async updateSettings(@Body() updateDto: UpdateSettingDto) {
    return this.settingsService.updateSettings(updateDto);
  }

  @Post('upload-qr')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload UPI QR code image' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadQr(@UploadedFile() file: Express.Multer.File) {
    const url = await this.imageUploadService.uploadImage(file);
    return { url };
  }

  @Post('upload-hero')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload Hero Slider banner image' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadHero(@UploadedFile() file: Express.Multer.File) {
    const url = await this.imageUploadService.uploadImage(file);
    return { url };
  }
}
