import { HttpServer } from '../../src/transport/http/core';

jest
  .spyOn(HttpServer.prototype, 'listen')
  .mockImplementation(() => Promise.resolve(true));
