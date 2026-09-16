import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend;
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.getOrThrow('RESEND_API_KEY'));
  }

  async addToQueue(data: { to: string; subject: string; body: string }) {
    const job = await this.emailQueue.add('sendEmail', data);
    return job.id;
  }

  async sendEmail(to: string, subject: string, body: string) {
    this.logger.log('sending email to ' + to);
    const { data, error } = await this.resend.emails.send({
      to,
      subject,
      html: body,
      from: 'Acme <onboarding@resend.dev>',
    });
  }
}
