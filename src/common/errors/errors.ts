export class BaseError {
  constructor(public message: string | string[]) {
  }
}

export class InvalidParamsError extends BaseError {
  constructor(message: string | string[]) {
    super(message);
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(message: string) {
    super(`Unprocessable entity: ${message}`);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super(`Forbidden: ${message}`);
  }
}

export class UnauthorizedError extends BaseError {
  constructor() {
    super('Unauthorized');
  }
}

export class NotFoundError extends BaseError {
}