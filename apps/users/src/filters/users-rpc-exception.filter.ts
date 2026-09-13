import { Catch, RpcExceptionFilter, type ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch()
export class UsersRpcExceptionFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(UsersRpcExceptionFilter.name);

  catch(exception: unknown, _host: ArgumentsHost): Observable<never> {
    const details =
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : JSON.stringify(exception);
    this.logger.error(`Exception: ${details}`);
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    return throwError(() => exception);
  }
}
