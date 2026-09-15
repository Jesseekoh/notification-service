import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  Logger,
  type RpcExceptionFilter,
  type ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
@Catch()
export class SharedRpcExceptionFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(SharedRpcExceptionFilter.name);

  catch(exception: unknown): Observable<never> {
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    if (exception instanceof Error) {
      this.logger.error(exception.stack ?? exception.message);

      return throwError(() => ({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      }));
    }

    this.logger.error(JSON.stringify(exception));

    return throwError(() => ({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    }));
  }
}

@Catch()
export class SharedRpcToHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SharedRpcToHttpExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();

    const details =
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : JSON.stringify(exception);
    this.logger.error(`Gateway Exception: ${details}`);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message =
        typeof res === 'object' && res !== null && 'message' in res
          ? (res as any).message
          : res;
      response.status(status).json({ statusCode: status, message });
      return;
    }
    const error = this.getErrorPayload(exception);
    const status =
      error.statusCode ?? error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message ?? 'Internal server error';
    response.status(status).json({ statusCode: status, message });
  }

  private getErrorPayload(exception: unknown): {
    statusCode?: number;
    status?: number;
    message?: string;
  } {
    if (typeof exception !== 'object' || exception === null) {
      return {};
    }

    const payload = 'error' in exception ? exception.error : exception;
    if (typeof payload !== 'object' || payload === null) {
      return typeof payload === 'string' ? { message: payload } : {};
    }

    return payload as {
      statusCode?: number;
      status?: number;
      message?: string;
    };
  }
}
