import { setTimeout as timeout } from 'timers/promises';

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

export function debounce(
  cb: (...args: any[]) => void,
  time: number
) {
  let controller: AbortController;

  return async (...args: any[]) => {
    if (controller) {
      controller.abort();
    }

    controller = new AbortController();

    try {
      await timeout(time, null, { signal: controller.signal });
      cb(...args);
    } catch {
      //
    }
  };
}
