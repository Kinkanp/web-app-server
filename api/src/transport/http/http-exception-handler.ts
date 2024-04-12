import { ClientErrorResponse, InternalErrorResponse, ExceptionHandler, HttpResponse } from '@packages/http-server';
import {
  BaseError,
  ForbiddenError,
  InvalidParamsError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError
} from '../../common/errors';
import { isDatabaseError } from '../../common/database';
import { inject, injectable } from 'inversify';
import { IAppLogger, LOGGER } from '../../common/logger';
import { APP_CONFIG, AppConfig } from '../../common/config';

@injectable()
export class AppHttpExceptionHandler implements ExceptionHandler {
  constructor(
    @inject(LOGGER) private logger: IAppLogger,
    @inject(APP_CONFIG) private config: AppConfig,
  ) {}

  public handle(res: HttpResponse, error: BaseError | Error): void {
    this.logger.debug('Exception handler', error);

    if (isDatabaseError(error as Error)) {
      this.logger.error(`Database error (5xx): ${error.message}`);
      return new InternalErrorResponse(res).status(500).message('Server database error').send();
    }

    const clientErrorCode = this.getClientErrorCode(error);

    if (clientErrorCode) {
      this.logger.info('Error handler', `Client error (4xx): ${error.message}`);
      return new ClientErrorResponse(res).status(clientErrorCode).message(error.message).send();
    }

    this.logger.error(`Uncaught error (5xx): ${error.message}`);
    return new InternalErrorResponse(res).status(500).message(error.message).send();
  }

  private getClientErrorCode(error: BaseError) {
    switch (error.constructor) {
      case ForbiddenError:
        return 403;
      case UnauthorizedError:
        return 401;
      case InvalidParamsError:
        return 400;
      case UnprocessableEntityError:
        return 422;
      case NotFoundError:
        return 404;
    }
  }
}
