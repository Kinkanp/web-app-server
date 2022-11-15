import { getAppConfig } from './common/config';
import { createConnection } from './common/database';
import { HttpServer } from './transport/http/core';
import { AppContainer } from './inversion';
import { HttpRoutes } from './transport/http/routes/routes';

const main = async () => {
  const config = getAppConfig();
  const connection = createConnection(config.database);

  AppContainer.set(connection, config);

  const httpServer = new HttpServer({ port: config.app.port, baseUrl: config.app.baseUrl });
  await httpServer.setRoutes(HttpRoutes.get()).create().listen();
};

main();
