import { expect } from 'vitest';
import request from 'supertest';

export function expectValidDate(value: string | Date): InstanceType<any> {
  const date = new Date(value);
  const isValid = date.toString() !== 'Invalid Date';

  if (isValid) {
    return expect.anything();
  }

  throw new Error(`Invalid date: ${value}`);
}

export function expectErrorResponse(res: request.Response, status?: number) {
  if (status) {
    expect(res.status).toEqual(status);
  } else {
    expect(res.status >= 400 && res.status < 500).toBeTruthy();
  }

  expect(res.status).toEqual(res.body.error.code);

  const { message } = res.body.error;

  if (Array.isArray(message)) {
    // TODO
    // expect(message).toContain(expect.any(String));
  } else {
    expect(message).toEqual(expect.any(String))
  }
}
