import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ExceptionFilter,
} from '@nestjs/common';

@Catch()
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcToHttpExceptionFilter.name);

  catch(exception: unknown, _host: ArgumentsHost): void {
    const details =
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : JSON.stringify(exception);
    this.logger.error(`RPC exception: ${details}`);

    if (typeof exception === 'object' && exception !== null) {
      const rpcError = exception as {
        message?: string;
        status?: number;
      };

      if (rpcError.message && rpcError.status) {
        throw new HttpException(rpcError.message, rpcError.status);
      }
    }

    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
