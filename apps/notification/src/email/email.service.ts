import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async addToQueue(data: { to: string; subject: string; body: string }) {
    await this.emailQueue.add('sendEmail', data);
  }
}
