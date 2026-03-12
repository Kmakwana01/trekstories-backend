import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomToursService } from './custom-tours.service';
import { CustomToursController } from './custom-tours.controller';
import { AdminCustomToursController } from './admin-custom-tours.controller';
import {
    CustomTourRequest,
    CustomTourRequestSchema,
} from './schemas/custom-tour-request.schema';
import { AdminModule } from '../admin/admin.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CustomTourRequest.name, schema: CustomTourRequestSchema },
        ]),
        AdminModule,
    ],
    providers: [CustomToursService],
    controllers: [CustomToursController, AdminCustomToursController],
})
export class CustomToursModule { }
