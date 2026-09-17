import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateTemplateDto } from './dto/update-template.dto.js';

@Injectable()
export class TemplatesService {
  constructor(
    @Inject('TEMPLATES_SERVICE')
    private readonly templatesServiceClient: ClientProxy,
  ) {}

  async createTemplate(data: {
    name: string;
    content: string;
    variables?: { name: string; required?: boolean }[];
  }) {
    return this.templatesServiceClient.send({ cmd: 'template.create' }, data);
  }

  async getTemplateById(id: string) {
    return this.templatesServiceClient.send({ cmd: 'template.findOne' }, id);
  }

  async getAllTemplates() {
    return this.templatesServiceClient.send({ cmd: 'template.findAll' }, {});
  }

  async updateTemplate(id: string, data: UpdateTemplateDto) {
    return this.templatesServiceClient.send(
      { cmd: 'template.update' },
      { id, ...data },
    );
  }

  async deleteTemplate(id: string) {
    return this.templatesServiceClient.send({ cmd: 'template.delete' }, id);
  }
}
