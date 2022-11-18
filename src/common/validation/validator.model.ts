export interface ValidatorSchemaModel {
  [key: string]: SchemaModelField;
}

export interface ValidatorOptions {
  todo?: boolean;
}

interface SchemaModelField {
  required?: boolean;
  type?: 'number' | 'string' | 'boolean'
}