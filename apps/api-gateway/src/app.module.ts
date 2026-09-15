import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { TemplatesModule } from './templates/templates.module.js';

@Module({
  imports: [UsersModule, TemplatesModule],
})
export class AppModule { }
