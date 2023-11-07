import Ajv, { ErrorObject, JSONSchemaType, ValidateFunction } from 'ajv';
import AjvErrors from 'ajv-errors';
import { InvalidParamsError } from '../errors';
import { PropertiesSchema } from 'ajv/dist/types/json-schema';
import { COMMON_SCHEMAS } from './common-schemas';

type FormattedValidationError = null | string[];

export interface ValidationResult<TValid> {
  errors: FormattedValidationError;
  data: TValid;
}

interface ValidateOptions {
  throwError?: boolean;
  errorMessage?: string;
}

export class Validator {
  private static ajv: Ajv;
  private static defaultOptions: ValidateOptions = { throwError: true }

  static {
    Validator.ajv = new Ajv({ allErrors: true });
    AjvErrors(Validator.ajv);
  }

  static registerSchema<TSchema>(schema: JSONSchemaType<TSchema>, key: string): void {
    this.ajv.addSchema(schema, key).compile(schema);
  }

  static validate<TValidData>(
    schema: string,
    data: unknown,
    options?: ValidateOptions
  ): ValidationResult<TValidData> {
    const validate = Validator.ajv.getSchema(schema) as ValidateFunction;
    options = { ...options, ...this.defaultOptions };
    validate(data);

    const errors = Validator.formatErrors(validate.errors);
    if (errors && options.throwError) {
      throw new InvalidParamsError(errors);
    }

    return { errors, data: data as TValidData };
  }

  // TODO: move common validations somewhere
  static object<TValidData>(
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

  static id(id: string | number): number {
    const { data } = this.validate<number>(
      COMMON_SCHEMAS.number,
      +id,
      { errorMessage: '`id` should be a number' }
    );
    return data;
  }

  static string(value: string | unknown): string {
    const { data } = this.validate<string>(COMMON_SCHEMAS.string, value);
    return data;
  }

  // TODO: move common validations somewhere: end

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
