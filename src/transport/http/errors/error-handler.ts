import { ClientErrorResponse, InternalErrorResponse } from '../core/responses';
import {
  ForbiddenError,
  InvalidParamsError,
  NotFoundError, UnauthorizedError,
  UnprocessableEntityError
} from '../../../common/validation/errors';
import { HttpResponse } from '../core';
import { DatabaseError } from '../../../common/database';

export function httpExceptionHandler(res: HttpResponse, error: Error): void {
  if (error instanceof DatabaseError) {
    return new InternalErrorResponse(res).status(500).message('Server database error').send();
  }

  const clientErrorCode = getClientErrorCode(error);

  if (clientErrorCode) {
    return new ClientErrorResponse(res).status(clientErrorCode).message(error.message).send();
  }

  return new InternalErrorResponse(res).status(500).send();
}

function getClientErrorCode(error: Error) {
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
