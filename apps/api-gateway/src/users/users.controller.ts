import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { RpcToHttpExceptionFilter } from '../rpc-exception.filter.js';
import { UsersService } from './users.service.js';

@Controller('users')
@UseFilters(RpcToHttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() data: { id: string; name: string }) {
    return this.usersService.createUser(data);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('notification-preference/:userId')
  async getNotificationPreferenceByUserId(@Param('userId') userId: string) {
    return this.usersService.getNotificationPreferenceByUserId(userId);
  }

  @Patch('notification-preference/:userId')
  async updateNotificationPreference(
    @Param('userId') userId: string,
    @Body() preferences: Partial<any>,
  ) {
    return this.usersService.updateNotificationPreference(userId, preferences);
  }
}
