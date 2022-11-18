import { getAppConfig } from './common/config';
import { createConnection } from './common/database';
import { HttpServer } from './transport/http/core';
import { HttpRoutes } from './transport/http/routes';
import { AppContainer } from './inversion';
import { httpExceptionHandler } from './transport/http/errors';

const main = async () => {
  const config = getAppConfig();
  const connection = createConnection(config.database);

  AppContainer.set(connection, config);

  await new HttpServer({ port: config.app.port, baseUrl: config.app.baseUrl })
    .setRoutes(HttpRoutes.get())
    .setExceptionHandler(httpExceptionHandler)
    .create()
    .listen();
};

main();
