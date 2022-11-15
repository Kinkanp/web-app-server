import { Routes } from '../core';
import { getUserRoutes } from './index';

export class HttpRoutes {
  public static get(): Routes {
    return [
      ...getUserRoutes()
    ]
  }
}
