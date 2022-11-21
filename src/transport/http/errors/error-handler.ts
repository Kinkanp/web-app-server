import { ClientErrorResponse, InternalErrorResponse } from '../core/responses';
import {
  BaseError,
  ForbiddenError,
  InvalidParamsError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError
} from '../../../common/errors';
import { HttpResponse } from '../core';
import { DatabaseError } from '../../../common/database';
import { inject, injectable } from 'inversify';
import { LOGGER } from '../../../inversion';
import { ILogger } from '../../../common/logger';

@injectable()
export class HttpExceptionHandler {
  constructor(@inject(LOGGER) private logger: ILogger) {}

  public handle(res: HttpResponse, error: BaseError): void {
    if (error instanceof DatabaseError) {
      this.logger.error(`Database error 500: ${error.message}`);
      return new InternalErrorResponse(res).status(500).message('Server database error').send();
    }

    const clientErrorCode = this.getClientErrorCode(error);

    if (clientErrorCode) {
      this.logger.info(`Client error 400: ${error.message}`);
      return new ClientErrorResponse(res).status(clientErrorCode).message(error.message).send();
    }

    this.logger.error(`Uncaught error 500: ${error.message}`);
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

// export function httpExceptionHandler(res: HttpResponse, error: BaseError): void {
//   if (error instanceof DatabaseError) {
//     return new InternalErrorResponse(res).status(500).message('Server database error').send();
//   }
//
//   const clientErrorCode = getClientErrorCode(error);
//
//   if (clientErrorCode) {
//     return new ClientErrorResponse(res).status(clientErrorCode).message(error.message).send();
//   }
//
//   return new InternalErrorResponse(res).status(500).message(error.message).send();
// }
//
// function getClientErrorCode(error: BaseError) {
//   switch (error.constructor) {
//     case ForbiddenError:
//       return 403;
//     case UnauthorizedError:
//       return 401;
//     case InvalidParamsError:
//       return 400;
//     case UnprocessableEntityError:
//       return 422;
//     case NotFoundError:
//       return 404;
//   }
// }
