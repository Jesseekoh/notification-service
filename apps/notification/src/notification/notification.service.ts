import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { EmailService } from '../email/email.service.js';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
    @Inject('TEMPLATES_SERVICE') private readonly templateService: ClientProxy,
    private readonly emailService: EmailService,
  ) {}

  async sendEmailNotification(dto: {
    userId: string;
    templateId?: string;
    body?: string;
    variables?: Record<string, any>;
    subject?: string;
  }) {
    const { userId, templateId, body, variables } = dto;

    const user = await firstValueFrom(
      this.usersService.send({ cmd: 'user.getById' }, userId),
    );

    if (!templateId && !body) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Either templateId or body must be provided',
      });
    }
    const notificationPreference = await firstValueFrom(
      this.usersService.send({ cmd: 'user.getNotificationPreference' }, userId),
    );

    if (!notificationPreference?.emailNotifications) {
      return;
    }

    const emailBody = templateId
      ? await this.resolveTemplateBody(templateId, variables)
      : body;

    this.emailService.addToQueue({
      to: user.email,
      subject: dto.subject ?? 'Notification',
      body: emailBody,
    });
    return { user, notificationPreference };
  }

  async resolveTemplateBody(
    templateId: string,
    variables: Record<string, any> = {},
  ) {
    const rendered = await firstValueFrom(
      this.templateService.send(
        { cmd: 'template.render' },
        { templateId, variables },
      ),
    );
    return rendered;
  }
}
