import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @MessagePattern({ cmd: 'user.create' })
  async createUser(@Payload() data: { email: string; name: string }) {
    return this.usersService.createUser(data);
  }

  @MessagePattern({ cmd: 'user.getById' })
  async getUserById(@Payload() id: string) {
    return this.usersService.getUserById(id);
  }

  @MessagePattern({ cmd: 'user.getNotificationPreference' })
  async getNotificationPreferenceByUserId(@Payload() userId: string) {
    return this.usersService.getNotificationPreferenceByUserId(userId);
  }

  @MessagePattern({ cmd: 'user.updateNotificationPreference' })
  async updateNotificationPreference(
    @Payload() data: { userId: string; preferences: Partial<any> },
  ) {
    const { userId, preferences } = data;
    return this.usersService.updateNotificationPreference(userId, preferences);
  }
}
