import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: 'notification.sendEmail' })
  async sendEmailNotification(
    @Payload() dto: { userId: string; templateId?: string; body?: string },
  ) {
    return this.notificationService.sendEmailNotification(dto);
  }
}
