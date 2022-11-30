import { expect } from 'vitest';

export function expectValidDate(value: string | Date): InstanceType<any> {
  const date = new Date(value);
  const isValid = date.toString() !== 'Invalid Date';

  if (isValid) {
    return expect.anything();
  }

  throw new Error(`Invalid date: ${value}`);
}