import { HttpServer } from '@packages/http-server';
import { Logger } from '../../src/common/logger';
import { vitest } from 'vitest';

// @ts-ignore
vitest.spyOn(Logger.prototype, 'disable')
  // @ts-ignore
  .mockImplementation(() => true);

vitest.spyOn(HttpServer.prototype, 'listen')
  .mockImplementation(() => Promise.resolve());
