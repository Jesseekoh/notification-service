import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { TemplatesModule } from './templates/templates.module.js';
import { NotificationModule } from './notification/notification.module.js';
import { APP_FILTER } from '@nestjs/core';
import { SharedRpcToHttpExceptionFilter } from '@notification/common';

@Module({
  imports: [UsersModule, TemplatesModule, NotificationModule],
  providers: [
    { provide: APP_FILTER, useClass: SharedRpcToHttpExceptionFilter },
  ],
})
export class AppModule {}
