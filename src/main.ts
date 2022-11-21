import { getAppConfig } from './common/config';
import { createConnection } from './common/database';
import { HttpServer } from './transport/http/core';
import { HttpRoutes } from './transport/http/routes';
import { APP_CONFIG, AppContainer, DB_CONNECTION, HTTP_EXCEPTION_HANDLER, LOGGER } from './inversion';
import { HttpExceptionHandler } from './transport/http/errors';
import { Logger } from './common/logger';

const main = (): { httpServer: HttpServer, closeConnection: () => Promise<void> } => {
  const config = getAppConfig();
  const connection = createConnection(config.database);

  AppContainer
    .setProvider(LOGGER, Logger)
    .setProvider(HTTP_EXCEPTION_HANDLER, HttpExceptionHandler)
    .setConstant(DB_CONNECTION, connection)
    .setConstant(APP_CONFIG, config);

  // test
  const errHandler = AppContainer.get<HttpExceptionHandler>(HTTP_EXCEPTION_HANDLER);

  const httpServer = new HttpServer({ port: config.app.port, baseUrl: config.app.baseUrl });

  httpServer
    .setRoutes(HttpRoutes.get())
    .setExceptionHandler((res, err) => errHandler.handle(res, err))
    .create()
    .listen();

  return { httpServer, closeConnection: () => connection.close() };
};

export default main();
