import { getUserRoutes } from './entities/user/user.routes';
import { Connection } from './common/database/database.model';
import { Routes } from './common/server';

export function getRoutes(connection: Connection): Routes {
  // TODO: add base url
  return [
    ...getUserRoutes(connection)
  ];
}