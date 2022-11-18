import { Routes } from '../core';
import { getUserRoutes } from './users/user.routes';

export class HttpRoutes {
  public static get(): Routes {
    return [
      ...getUserRoutes()
    ]
  }
}
