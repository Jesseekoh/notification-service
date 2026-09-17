import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TemplatesService } from './templates.service.js';
import { CreateTemplateDto } from './dto/create-template.dto.js';
import { UpdateTemplateDto } from './dto/update-template.dto.js';

@Controller()
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @MessagePattern({ cmd: 'template.create' })
  create(@Payload() createTemplateDto: CreateTemplateDto) {
    return this.templatesService.create(createTemplateDto);
  }

  @MessagePattern({ cmd: 'template.findAll' })
  findAll() {
    return this.templatesService.findAll();
  }

  @MessagePattern({ cmd: 'template.findOne' })
  findOne(@Payload() id: string) {
    return this.templatesService.findOne(id);
  }

  @MessagePattern({ cmd: 'template.update' })
  update(@Payload() updateTemplateDto: UpdateTemplateDto) {
    return this.templatesService.update(
      updateTemplateDto.id,
      updateTemplateDto,
    );
  }

  @MessagePattern({ cmd: 'template.render' })
  async renderTemplate(
    @Payload() data: { templateId: string; variables: any },
  ) {
    const { templateId, variables } = data;
    return this.templatesService.renderTemplate(templateId, variables);
  }

  @MessagePattern({ cmd: 'template.delete' })
  remove(@Payload() id: string) {
    return this.templatesService.remove(id);
  }
}
