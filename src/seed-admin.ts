import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './database/schemas/user.schema';
import { Role } from './common/enums/roles.enum';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';
import { Gender } from './common/enums/gender.enum';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const logger = new Logger('SeedAdmin');
    const app = await NestFactory.createApplicationContext(SeedModule);

    const configService = app.get(ConfigService);
    const dbUri = configService.get('database.uri');
    logger.log(`Connecting to database: ${dbUri?.replace(/\/\/.*@/, '//****:****@')}`);

    const userModel = app.get(getModelToken(User.name));

    const adminEmail = 'shivanshholidays27@gmail.com';
    const adminPass = 'Shivansh_0176';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPass, salt);

    const existingAdmin = await userModel.findOne({ email: adminEmail });

    if (existingAdmin)
    {
        existingAdmin.role = Role.ADMIN;
        existingAdmin.isVerified = true;
        existingAdmin.passwordHash = passwordHash;
        existingAdmin.gender = 'MALE';
        existingAdmin.country = 'India';
        existingAdmin.contactAddress = '123 Admin St, New Delhi';
        existingAdmin.name = 'System Admin';
        existingAdmin.phone = '+919999999999';
        await existingAdmin.save();
        logger.log('Admin user updated successfully.');
    } else
    {
        await userModel.create({
            name: 'System Admin',
            email: adminEmail,
            passwordHash: passwordHash,
            role: Role.ADMIN,
            isVerified: true,
            phone: '+919909899025',
            gender: Gender.MALE,
            dateOfBirth: new Date('1990-01-01'),
            country: 'India',
            contactAddress: 'Office No 426, 4th Floor, Star Plaza Phulchhab Chowk, Rajkot, Gujarat, India - 360001',
            lastLogin: new Date(),
        });
        logger.log('Admin user created successfully.');
    }

    logger.log('----------------------------------------');
    logger.log(`Email: ${adminEmail}`);
    logger.log(`Password: ${adminPass}`);
    logger.log('Use these credentials to log into the Admin Panel.');
    logger.log('----------------------------------------');

    await app.close();
    process.exit(0);
}

bootstrap();
