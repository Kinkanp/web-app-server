import { getUserRoutes } from './entities/user/user.routes';
import { Routes } from './common/http';

export function getRoutes(): Routes {
  // TODO: add base url
  return [
    ...getUserRoutes()
  ];
}