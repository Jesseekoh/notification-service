import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service.js';
import { TemplatesController } from './templates.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateSchema } from './schemas/template.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Template', schema: TemplateSchema }]),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
})
export class TemplatesModule {}
