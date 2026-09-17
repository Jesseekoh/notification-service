import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TemplatesService } from './templates.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateTemplateDto } from './dto/create-template.dto.js';
import { UpdateTemplateDto } from './dto/update-template.dto.js';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async createTemplate(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateTemplateDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const content = file.buffer.toString('utf-8');

    const variables =
      typeof dto.variables === 'string'
        ? JSON.parse(dto.variables)
        : (dto.variables ?? []);

    return this.templatesService.createTemplate({
      ...dto,
      variables,
      content,
    });
  }

  @Get(':id')
  getTemplate(@Param('id') id: string) {
    return this.templatesService.getTemplateById(id);
  }

  @Get()
  getAllTemplates() {
    return this.templatesService.getAllTemplates();
  }

  @Delete(':id')
  deleteTemplate(@Param('id') id: string) {
    return this.templatesService.deleteTemplate(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.templatesService.updateTemplate(id, dto);
  }
}
