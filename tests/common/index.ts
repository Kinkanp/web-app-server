import './server-mocks';
import createServer from '../../src/main';
import { HttpRequest, HttpResponse } from '../../src/transport/http/core';

type Response = (req: HttpRequest, res: HttpResponse) => Promise<void>;

export function getHttpRequest(): Response {
  const { httpServer, closeConnection } = createServer;

  // @ts-ignore
  httpServer.handleRequest = httpServer.handleRequest.bind(httpServer);

  return async (req, res) => {
    // @ts-ignore
    const data = await httpServer.handleRequest(req, res);

    await Promise.all([
      httpServer.close(),
      closeConnection()
    ])

    return data;
  };
}