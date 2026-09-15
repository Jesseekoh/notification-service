import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service.js';
import { TemplatesController } from './templates.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TEMPLATES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
  ],
  providers: [TemplatesService],
  controllers: [TemplatesController],
})
export class TemplatesModule {}
