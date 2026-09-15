import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type TemplateDocument = HydratedDocument<Template>;

@Schema({ _id: false })
class TemplateVariable {
  @Prop({ required: true })
  name: string; // e.g. "resetUrl"

  @Prop({ default: false })
  required: boolean;
}
@Schema()
export class Template {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [TemplateVariable] })
  variables?: TemplateVariable[];
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
