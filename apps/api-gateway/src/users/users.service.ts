import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client/index.js';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
  ) {}

  async createUser(data: { id: string; name: string }) {
    return this.usersService.send({ cmd: 'user.create' }, data);
  }

  async getUserById(id: string) {
    return this.usersService.send({ cmd: 'user.getById' }, id);
  }

  async getNotificationPreferenceByUserId(userId: string) {
    return this.usersService.send(
      { cmd: 'user.getNotificationPreference' },
      userId,
    );
  }

  async updateNotificationPreference(
    userId: string,
    preferences: Partial<any>,
  ) {
    return this.usersService.send(
      { cmd: 'user.updateNotificationPreference' },
      { userId, preferences },
    );
  }
}
