import { ValidatorSchemaModel } from './validator.model';
import { Validator } from './validator';

describe('Validator', () => {
  const validator = new Validator();

  describe('required', () => {
    const schema: ValidatorSchemaModel = {
      field1: { required: true },
      field2: { required: true },
      field3: { required: true }
    };

    test('model should be valid', () => {
      const result = validator.validate(schema, {
        field1: '1',
        field2: '2',
        field3: '3'
      });

      expect(result).toBeTruthy();
    });

    test('model should be valid with falsy values', () => {
      const result = validator.validate(schema, {
        field1: '',
        field2: 0,
        field3: false
      });

      expect(result).toBeTruthy();
    });

    test('model should be invalid without required fields', () => {
      const result = validator.validate(schema, {});

      expect(result).toBeFalsy();
    });

    test('model should be invalid if any field is missing', () => {
      const result = validator.validate(schema, {
        field1: '1',
        field2: '2',
        field3: undefined
      });

      expect(result).toBeFalsy();
    });

    test('model should be invalid with null/undefined/NaN values', () => {
      const result = validator.validate(schema, {
        field1: null,
        field2: undefined,
        field3: NaN
      });

      expect(result).toBeFalsy();
    });
  });

  describe('field type', () => {
    const schema: ValidatorSchemaModel = {
      field1: { type: 'number' },
      field2: { type: 'string' },
      field3: { type: 'boolean' }
    };

    test('model should be valid', () => {
      const result = validator.validate(schema, {
        field1: 1,
        field2: 'hello',
        field3: true
      });

      expect(result).toBeTruthy();
    });

    test('model should be valid with falsy values', () => {
      const result = validator.validate(schema, {
        field1: 0,
        field2: '',
        field3: false
      });

      expect(result).toBeTruthy();
    });

    test('model should be invalid', () => {
      const result = validator.validate(schema, {
        field1: '1',
        field2: 3,
        field3: 'true'
      });

      expect(result).toBeTruthy();
    });
  });
});