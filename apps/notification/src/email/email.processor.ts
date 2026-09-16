import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from './email.service.js';
import { Logger } from '@nestjs/common';

@Processor('email')
export class EmailConsumer extends WorkerHost {
  private readonly logger = new Logger(EmailConsumer.name);
  constructor(private readonly emailService: EmailService) {
    super();
  }
  async process(job: Job): Promise<any> {
    await this.emailService.sendEmail(
      job.data.to,
      job.data.subject,
      job.data.body,
    );
  }
}
