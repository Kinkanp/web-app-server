import Ajv, { ErrorObject, JSONSchemaType, JSONType, ValidateFunction } from 'ajv';
import AjvErrors from 'ajv-errors';
import { InvalidParamsError } from '../errors';
import { PropertiesSchema } from 'ajv/dist/types/json-schema';

type FormattedValidationError = null | string[];

interface ValidationResult<TValid> {
  errors: FormattedValidationError;
  data: TValid;
}

interface ValidateOptions {
  throwError?: boolean;
  errorMessage?: string;
}

export class Validator {
  private static ajv: Ajv;

  static {
    Validator.ajv = new Ajv({ allErrors: true });
    AjvErrors(Validator.ajv);
  }

  static registerSchema<TSchema>(schema: JSONSchemaType<TSchema>, key: string): void {
    this.ajv.addSchema(schema, key).compile(schema);
  }

  static validate<TValidData>(key: string, data: unknown, options?: ValidateOptions): ValidationResult<TValidData> {
    const validate = Validator.ajv.getSchema(key) as ValidateFunction;
    validate(data);

    const errors = Validator.formatErrors(validate.errors);
    if (errors && options?.throwError) {
      throw new InvalidParamsError(errors);
    }

    return { errors, data: data as TValidData };
  }

  static requiredObject<TValidData>(
    data: Partial<TValidData>,
    properties: PropertiesSchema<TValidData>
  ): Required<TValidData> {
    const schema = {
      type: 'object',
      properties,
      additionalProperties: false,
      required: Object.keys(properties)
    };
    const validate = Validator.ajv.compile(schema);

    return this.runSchema<Required<TValidData>>(validate, data as Required<TValidData>);
  }

  static required<TValidData = (string | number | boolean)>(
    data: TValidData | undefined | null,
    type: JSONType,
    options?: ValidateOptions
  ): Required<TValidData> {
    const schema = { type, errorMessage: options?.errorMessage };
    const validate = Validator.ajv.compile(schema);

    return this.runSchema<Required<TValidData>>(validate, data as Required<TValidData>);
  }

  private static runSchema<TValidData>(validate: ValidateFunction, data: TValidData): TValidData {
    validate(data);

    const errors = Validator.formatErrors(validate.errors);
    if (errors) {
      throw new InvalidParamsError(errors);
    }

    return data as TValidData;
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
