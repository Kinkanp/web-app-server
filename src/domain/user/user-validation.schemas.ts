import { Validator } from '../../common/validation';
import { CreateUserParams } from './user.models';

export enum UserValidationSchemas {
  create = 'createUserSchema',
  getOne = 'getOneUserSchema',
}

Validator.registerSchema<CreateUserParams>(
  {
    type: 'object',
    properties: {
      firstName: { type: 'string', maxLength: 255 },
      lastName: { type: 'string', maxLength: 255 }
    },
    required: ['firstName', 'lastName'],
    additionalProperties: false
  },
  UserValidationSchemas.create
);

Validator.registerSchema<number>(
  {
    type: 'number',
    errorMessage: '`id` should be a number'
  },
  UserValidationSchemas.getOne
);