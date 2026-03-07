import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './database/schemas/user.schema';
import { Role } from './common/enums/roles.enum';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('SeedAdmin');
    const app = await NestFactory.createApplicationContext(AppModule);
    const userModel = app.get(getModelToken(User.name));

    const adminEmail = 'info@trekstories.in';
    const adminPass = 'Shivansh@1212';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPass, salt);

    const existingAdmin = await userModel.findOne({ email: adminEmail });

    if (existingAdmin)
    {
        existingAdmin.role = Role.ADMIN;
        existingAdmin.isVerified = true;
        existingAdmin.passwordHash = passwordHash;
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
            phone: '+910000000000',
        });
        logger.log('Admin user created successfully.');
    }

    logger.log('Email: ' + adminEmail);
    logger.log('Password: ' + adminPass);

    await app.close();
    process.exit(0);
}

bootstrap();
