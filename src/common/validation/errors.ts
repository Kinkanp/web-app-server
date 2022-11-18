export class InvalidParamsError extends Error {
  constructor(message: string) {
    super(`Invalid params: ${message}`);
  }
}

export class UnprocessableEntityError extends Error {
  constructor(message: string) {
    super(`Unprocessable entity: ${message}`);
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('Forbidden');
  }
}


export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}