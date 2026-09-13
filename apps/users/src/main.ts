import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersRpcExceptionFilter } from './filters/users-rpc-exception.filter.js';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    },
  );
  app.useGlobalFilters(new UsersRpcExceptionFilter());
  app.useLogger(app.get(Logger));
  await app.listen();
}
await bootstrap();
