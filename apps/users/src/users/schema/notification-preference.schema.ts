import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from './user.schema.js';

export type NotificationPreferenceDocument =
  HydratedDocument<NotificationPreference>;
@Schema()
export class NotificationPreference {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
  @Prop({ default: true })
  emailNotifications: boolean;

  @Prop({ default: true })
  pushNotifications: boolean;
}

export const NotificationPreferenceSchema = SchemaFactory.createForClass(
  NotificationPreference,
);
