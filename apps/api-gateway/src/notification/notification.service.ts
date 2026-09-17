import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: ClientProxy,
  ) {}

  async sendEmailNotification(dto: {
    userId: string;
    templateId?: string;
    body?: string;
  }) {
    return this.notificationService.send(
      { cmd: 'notification.sendEmail' },
      dto,
    );
  }
}
