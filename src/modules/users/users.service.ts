import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SavedTravelerDto } from './dto/saved-traveler.dto';
import { paginate, PaginationQuery } from '../../common/helpers/pagination.helper';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel('Booking') private bookingModel: Model<any>,
        @InjectModel('Review') private reviewModel: Model<any>,
    ) { }

    async getProfile(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user)
        {
            throw new NotFoundException('User not found');
        }
        return this.sanitizeUser(user);
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $set: updateProfileDto },
            { returnDocument: 'after', runValidators: true, returnDocument: 'after' } as any,
        );

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        return this.sanitizeUser(user);
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;
        const user = await this.userModel.findById(userId);

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch)
        {
            throw new BadRequestException('Invalid old password');
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        return { message: 'Password changed successfully' };
    }

    async getSavedTravelers(userId: string) {
        const user = await this.userModel.findById(userId).select('savedTravelers');
        if (!user)
        {
            throw new NotFoundException('User not found');
        }
        return user.savedTravelers;
    }

    async addSavedTraveler(userId: string, travelerDto: SavedTravelerDto) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $push: { savedTravelers: travelerDto } },
            { returnDocument: 'after', returnDocument: 'after' } as any,
        );

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        return user.savedTravelers;
    }

    async removeSavedTraveler(userId: string, travelerId: string) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { savedTravelers: { _id: travelerId } } },
            { returnDocument: 'after', returnDocument: 'after' } as any,
        );

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        return user.savedTravelers;
    }

    async getMyBookings(userId: string, paginationQuery: PaginationQuery) {
        return paginate(
            this.bookingModel,
            { user: new Types.ObjectId(userId) },
            paginationQuery,
        );
    }

    async getMyReviews(userId: string, paginationQuery: PaginationQuery) {
        return paginate(
            this.reviewModel,
            { user: new Types.ObjectId(userId) },
            paginationQuery,
        );
    }

    private sanitizeUser(user: UserDocument) {
        const obj = user.toObject();
        delete obj.passwordHash;
        delete obj.refreshTokenHash;
        delete obj.otp;
        delete obj.otpExpiry;
        delete obj.resetToken;
        delete obj.resetTokenExpiry;
        return obj;
    }
}
