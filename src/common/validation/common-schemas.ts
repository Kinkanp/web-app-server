import { Validator } from './validator';

export enum COMMON_SCHEMAS {
  number = 'number',
  string = 'string'
}

Validator.registerSchema<number>(
  { type: 'integer', errorMessage: '`value` should be a number' },
  COMMON_SCHEMAS.number
);

Validator.registerSchema<string>(
  { type: 'string', errorMessage: '`value` should be a string' },
  COMMON_SCHEMAS.string
);
