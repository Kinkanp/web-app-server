import { Routes } from '../core';
import { getUserRoutes } from './users/user.routes';

export class HttpRoutes {
  static get(): Routes {
    return [
      ...getUserRoutes()
    ]
  }
}
