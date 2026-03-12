import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { CustomToursService } from './custom-tours.service';
import { FilterCustomTourRequestDto, UpdateCustomTourStatusDto } from './dto/filter-custom-tour-request.dto';

@Controller('admin/custom-tours')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCustomToursController {
    constructor(private readonly service: CustomToursService) { }

    @Get('stats')
    async getStats() {
        return this.service.getStats();
    }

    @Get()
    async getAll(@Query() filter: FilterCustomTourRequestDto) {
        return this.service.findAll(filter);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateCustomTourStatusDto,
    ) {
        return this.service.updateStatus(id, dto);
    }
}
