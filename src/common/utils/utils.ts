export function excludeFields<T, Key extends keyof T>(model: T, fields: Key[]): Omit<T, Key>
export function excludeFields<T, Key extends keyof T>(model: T[], fields: Key[]): Omit<T, Key>[]
export function excludeFields<T, Key extends keyof T>(model: T | null, fields: Key[]): Omit<T, Key> | null
export function excludeFields<T, Key extends keyof T>(model: T | T[], fields: Key[]): Omit<T, Key> | Omit<T, Key>[] {
  const removeFields = (model: T) => {
    if (model) {
      fields.forEach(field => delete model[field]);
    }

    return model as Omit<T, Key>;
  }

  return Array.isArray(model) ? model.map(removeFields) : removeFields(model);
}

