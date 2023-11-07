import { ClassConstructor } from './ioc.constants';

export function isClass(value: unknown): value is ClassConstructor {
  const classValue = 'class';
  // @ts-ignore
  const constructor = value?.prototype?.constructor?.toString();

  return constructor?.startsWith(classValue);
}
