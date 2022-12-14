import { Routes } from '@packages/http-server';
import { getUserRoutes } from './users/user.routes';
import { getAuthRoutes } from './auth/auth.routes';
import { IRequestContextValues } from '../http.constants';

export class HttpRoutes {
  static get(): Routes<IRequestContextValues> {
    return [
      {
        path: '/health',
        method: 'GET',
        handler: async () => ({ status: 'Healthy' })
      },
      ...getAuthRoutes(),
      ...getUserRoutes()
    ];
  }
}
