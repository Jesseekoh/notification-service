import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { APP_FILTER } from '@nestjs/core';
import { SharedRpcExceptionFilter } from '@notification/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from './email/email.module.js';
import { NotificationModule } from './notification/notification.module.js';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    EmailModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: SharedRpcExceptionFilter },
  ],
})
export class AppModule {}
