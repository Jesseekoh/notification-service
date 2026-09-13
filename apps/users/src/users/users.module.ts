import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema.js';
import { NotificationPreferenceSchema } from './schema/notification-preference.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'NotificationPreference', schema: NotificationPreferenceSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
