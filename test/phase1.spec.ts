import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { DatabaseModule } from '../src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { Model } from 'mongoose';
import { User } from '../src/database/schemas/user.schema';
import { Tour } from '../src/database/schemas/tour.schema';

describe('Phase 1: Database Schemas', () => {
    let module: TestingModule;
    let userModel: Model<User>;
    let tourModel: Model<Tour>;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration],
                }),
                DatabaseModule,
            ],
        }).compile();

        userModel = module.get<Model<User>>(getModelToken('User'));
        tourModel = module.get<Model<Tour>>(getModelToken('Tour'));
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
        expect(userModel).toBeDefined();
        expect(tourModel).toBeDefined();
    });

    it('should validate required fields for User', async () => {
        const user = new userModel({});
        try
        {
            await user.validate();
        } catch (e)
        {
            expect(e.errors.name).toBeDefined();
            expect(e.errors.email).toBeDefined();
        }
    });

    it('should validate required fields for Tour', async () => {
        const tour = new tourModel({});
        try
        {
            await tour.validate();
        } catch (e)
        {
            expect(e.errors.title).toBeDefined();
            expect(e.errors.slug).toBeDefined();
            expect(e.errors.basePrice).toBeDefined();
        }
    });
});
