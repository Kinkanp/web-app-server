import Ajv, { ErrorObject, JSONSchemaType, ValidateFunction } from 'ajv';
import AjvErrors from 'ajv-errors';

type FormattedValidationError = null | string[];

export class Validator {
  private static ajv: Ajv;

  static {
    Validator.ajv = new Ajv({ allErrors: true });

    AjvErrors(Validator.ajv);
  }

  static registerSchema<TSchema>(schema: JSONSchemaType<TSchema>, key: string): void {
    this.ajv.addSchema(schema, key);
    this.ajv.compile(schema);
  }

  static validate(key: string, data: unknown): FormattedValidationError {
    const validate = Validator.ajv.getSchema(key) as ValidateFunction;

    validate(data);

    return Validator.formatErrors(validate.errors);
  }

  private static formatErrors(errors?: ErrorObject[] | null): FormattedValidationError {
    if (!errors?.length) {
      return null;
    }

    return errors.map(error => {
      const fieldName = error.instancePath.replace('/', '');
      return `${fieldName ? fieldName + ': ' : ''}${error.message}`;
    });
  }
}
