import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto.js';
import { UpdateTemplateDto } from './dto/update-template.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './schemas/template.schema.js';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import Handlebars from 'handlebars';

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);
  constructor(
    @InjectModel(Template.name) private templateModel: Model<Template>,
  ) {}
  async create(createTemplateDto: CreateTemplateDto) {
    const newTemplate = await this.templateModel.create(createTemplateDto);
    return newTemplate;
  }
  async findAll() {
    return await this.templateModel.find().exec();
  }

  async findOne(id: string) {
    const template = await this.templateModel.findById(id).exec();
    if (!template) {
      throw new RpcException({
        statusCode: 404,
        message: `Template with id ${id} not found`,
      });
    }
    return template;
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    const updatedTemplate = await this.templateModel
      .findByIdAndUpdate(id, updateTemplateDto, { returnDocument: 'after' })
      .exec();

    if (!updatedTemplate) {
      throw new RpcException({
        statusCode: 404,
        message: `Template with id ${id} not found`,
      });
    }

    return updatedTemplate;
  }

  async remove(id: string) {
    return await this.templateModel.findByIdAndDelete(id).exec();
  }

  async renderTemplate(
    templateId: string,
    variables: Record<string, any> = {},
  ) {
    const template = await this.findOne(templateId);
    try {
      const compiledBody = Handlebars.compile(template.content);
      const body = compiledBody(variables);

      console.log(variables);
      return { body };
    } catch (err) {
      this.logger.error(
        `Failed to render template ${templateId}`,
        (err as Error).stack,
      );
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to render template ${templateId}`,
      });
    }
  }
}
