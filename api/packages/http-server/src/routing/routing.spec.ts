import { describe, expect, test } from 'vitest';
import { HttpRouting } from './routing';

describe('routing', () => {
  test('should create routes' , () => {
    const routing = new HttpRouting([], '');

    expect(routing).toBeTruthy();
  })

  test.todo('should match route `/`', () => {
    // TODO
  });

  test.todo('should match route `/path`', () => {
    // TODO
  });

  test.todo('should match route `/path/to/route`', () => {
    // TODO
  });

  test.todo('should match route `/path/1`', () => {
    // TODO
  });

  test.todo('should match route `/path/to/2`', () => {
    // TODO
  });

  test.todo('should handle not existing route', () => {
    // TODO
  });
})
