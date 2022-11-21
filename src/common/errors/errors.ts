export class BaseError {
  constructor(public message: string | string[]) {
  }
}

export class InvalidParamsError extends BaseError {
}

export class UnprocessableEntityError extends BaseError {
  constructor(message: string) {
    super(`Unprocessable entity: ${message}`);
  }
}

export class ForbiddenError extends BaseError {
  constructor() {
    super('Forbidden');
  }
}


export class UnauthorizedError extends BaseError {
  constructor() {
    super('Unauthorized');
  }
}

export class NotFoundError extends BaseError {
}