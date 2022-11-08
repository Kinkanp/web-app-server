import { AppConfig } from './common/config';
import { createConnection } from './common/database';
import { AppServer } from './common/server';
import { getRoutes } from './app.routes';
import { QueryBuilder } from './common/database/query-builder/query-builder';

const main = async () => {
  const config = new AppConfig().get();
  const connection = createConnection(config.database);
  const server = new AppServer({ port: config.app.port });

  // await connection.query("DELETE FROM users WHERE id <= 4");
  // await connection.query("INSERT INTO users(username) VALUES ('steven')");
  // const data = await connection.query('select * from users;');
  try {
    const data = await new QueryBuilder(connection, 'users')
    .select(['username', 'id'])
    .where({ id: '>=1' })
    .run();
    console.log(data);
  } catch {
    console.log('error caught');
  }

  const routes = getRoutes(connection);

  server.setRoutes(routes);
  server.create().listen();
};

main();
