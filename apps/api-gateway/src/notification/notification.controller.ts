import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service.js';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-email')
  async sendEmailNotification(
    @Body() dto: { userId: string; templateId?: string; body?: string },
  ) {
    console.log(
      'NotificationController.sendEmailNotification called with dto:',
      dto,
    );
    return this.notificationService.sendEmailNotification(dto);
  }
}
