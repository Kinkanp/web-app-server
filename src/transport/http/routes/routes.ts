import { Routes } from '../core';
import { getUserRoutes } from './users/user.routes';

export class HttpRoutes {
  static get(): Routes {
    return [
      {
        path: '/health',
        method: 'GET',
        handler: async () => ({ status: 'Healthy' })
      },
      ...getUserRoutes()
    ]
  }
}
