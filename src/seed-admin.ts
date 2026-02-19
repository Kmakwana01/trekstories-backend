import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './database/schemas/user.schema';
import { Role } from './common/enums/roles.enum';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userModel = app.get(getModelToken(User.name));

    const adminEmail = 'admin@test.com';
    const adminPass = 'adminpass';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPass, salt);

    const existingAdmin = await userModel.findOne({ email: adminEmail });

    if (existingAdmin)
    {
        existingAdmin.role = Role.ADMIN;
        existingAdmin.isVerified = true;
        existingAdmin.passwordHash = passwordHash;
        await existingAdmin.save();
        console.log('Admin user updated successfully.');
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
        console.log('Admin user created successfully.');
    }

    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPass);

    await app.close();
    process.exit(0);
}

bootstrap();
