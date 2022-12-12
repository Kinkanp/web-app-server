import { HttpServer } from '../../src/transport/http/core';
import { Logger } from '../../src/common/logger';
import { vitest } from 'vitest';

// @ts-ignore
vitest.spyOn(Logger.prototype, 'canLog')
  // @ts-ignore
  .mockImplementation(() => false);

vitest.spyOn(HttpServer.prototype, 'listen')
  .mockImplementation(() => null);
