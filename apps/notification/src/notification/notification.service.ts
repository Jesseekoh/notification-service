import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { EmailService } from '../email/email.service.js';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: ClientProxy,
    @Inject('TEMPLATES_SERVICE') private readonly templateService: ClientProxy,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
    if (!templateId && !body) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Either templateId or body must be provided',
      });
    }

    const [user, notificationPreference] = await Promise.all([
      this.getOrFetch(
        `user-${userId}`,
        () =>
          firstValueFrom(
            this.usersService.send({ cmd: 'user.getById' }, userId),
          ),
        15 * 60 * 1000,
      ),
      this.getOrFetch(
        `notification-pref-${userId}`,
        () =>
          firstValueFrom(
            this.usersService.send(
              { cmd: 'user.getNotificationPreference' },
              userId,
            ),
          ),
        2 * 60 * 1000,
      ),
    ]);

    if (!notificationPreference?.emailNotifications) {
      return;
    }

    const emailBody = templateId
      ? await this.resolveTemplateBody(templateId, variables)
      : body;

    const jobId = await this.emailService.addToQueue({
      to: user.email,
      subject: dto.subject ?? 'Notification',
      body: emailBody,
    });
    return { message: 'queued', jobId };
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

  private async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number,
  ) {
    const cached = await this.cacheManager.get<T>(key);
    if (cached) {
      return cached;
    }

    const data = await fetcher();
    await this.cacheManager.set(key, data, ttl);
  }
}
