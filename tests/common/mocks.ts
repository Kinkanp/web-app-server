import { HttpServer } from '@packages/http-server';
import { vitest } from 'vitest';
import { Logger } from '@packages/logger';

// @ts-ignore
vitest.spyOn(Logger.prototype, 'disable')
  // @ts-ignore
  .mockImplementation(() => true);

vitest.spyOn(HttpServer.prototype, 'listen')
  .mockImplementation(() => Promise.resolve());
