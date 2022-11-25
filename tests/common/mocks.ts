import { HttpServer } from '../../src/transport/http/core';
import { Logger } from '../../src/common/logger';

// @ts-ignore
jest.spyOn(Logger.prototype, 'canLog')
  // @ts-ignore
  .mockImplementation(() => false);

jest.spyOn(HttpServer.prototype, 'listen')
  .mockImplementation(() => null);