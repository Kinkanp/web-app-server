import { AppConfig } from './common/config';
import { createConnection } from './common/database';
import { AppServer } from './common/http';
import { getRoutes } from './app.routes';
import { ProvidersManager } from './common/provider';
import { getAppProviders } from './app.providers';

const main = async () => {
  const config = new AppConfig().get();
  const connection = createConnection(config.database);
  const server = new AppServer({ port: config.app.port });

  await ProvidersManager.set(getAppProviders()).init(connection);
  await server.setRoutes(getRoutes()).create().listen();
};

main();
