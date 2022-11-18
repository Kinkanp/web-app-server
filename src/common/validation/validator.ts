import { ValidatorOptions, ValidatorSchemaModel } from './validator.model';

export class Validator {


  public validate(schema: ValidatorSchemaModel, data: Record<string, unknown>): boolean {
    return true;
  }
}