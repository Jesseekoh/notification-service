import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema.js';
import { NotificationPreference } from './schema/notification-preference.schema.js';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(NotificationPreference.name)
    private readonly notificationPreferenceModel: Model<NotificationPreference>,
  ) {}

  async createUser(user: { id: number; name: string }) {
    try {
      const newUser = await this.userModel.create(user);
      await this.notificationPreferenceModel.create({ userId: newUser._id });
      return newUser;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new RpcException({
          message: 'User with this email already exists',
          status: HttpStatus.CONFLICT,
        });
      }
      throw new RpcException({
        message: 'Internal server error',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUserById(id: number) {
    return this.userModel.findOne({ id }).exec();
  }

  async getNotificationPreferenceByUserId(userId: string) {
    return this.notificationPreferenceModel.findOne({ userId }).exec();
  }

  async updateNotificationPreference(
    userId: string,
    preferences: Partial<NotificationPreference>,
  ) {
    return this.notificationPreferenceModel
      .findOneAndUpdate({ userId }, preferences, { new: true })
      .exec();
  }
}
