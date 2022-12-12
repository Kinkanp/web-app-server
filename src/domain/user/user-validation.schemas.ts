import { Validator } from '../../common/validation';
import { CreateUserParams } from './user.models';

export enum UserValidationSchemas {
  create = 'createUserSchema'
}

Validator.registerSchema<Defined<CreateUserParams>>(
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
  UserValidationSchemas.create
);
