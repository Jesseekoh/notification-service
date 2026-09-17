import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { NotificationController } from './notification.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailModule } from '../email/email.module.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001, host: 'localhost' },
      },
      {
        name: 'TEMPLATES_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002, host: 'localhost' },
      },
    ]),
    EmailModule,
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
