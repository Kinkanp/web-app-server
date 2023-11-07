import { Validator } from '../../common/validation';
import { CreateUserParams } from './user.models';
import { injectable } from 'inversify';

@injectable()
export class UserValidator {
  private schemas = {
    create: 'createUserSchema'
  };

  constructor() {
    this.setCreateSchema();
  }

  public validateCreate(params: CreateUserParams): void {
    Validator.validate<CreateUserParams>(this.schemas.create, params);
  }

  private setCreateSchema(): void {
    Validator.registerSchema<CreateUserParams>(
      {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            maxLength: 50
          },
          password: {
            type: 'string',
            maxLength: 16,
            minLength: 8
          }
        },
        required: ['username', 'password'],
        additionalProperties: false
      },
      this.schemas.create
    );
  }
}
