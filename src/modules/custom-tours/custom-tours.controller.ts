import { Body, Controller, Post } from '@nestjs/common';
import { CustomToursService } from './custom-tours.service';
import { CreateCustomTourRequestDto } from './dto/create-custom-tour-request.dto';

@Controller('custom-tours')
export class CustomToursController {
    constructor(private readonly service: CustomToursService) { }

    /** Public — any visitor can submit a custom tour request */
    @Post('request')
    async submitRequest(@Body() dto: CreateCustomTourRequestDto) {
        const result = await this.service.create(dto);
        return {
            success: true,
            message: 'Your custom tour request has been received! We will contact you shortly.',
            data: { id: result._id },
        };
    }
}
