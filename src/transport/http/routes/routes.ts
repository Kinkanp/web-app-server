import { getUserRoutes } from './user/user.routes';
import { getAuthRoutes } from './auth/auth.routes';
import { AppRoutes } from '../http.constants';
import { getPostRoutes } from './post/post.routes';

export class HttpRoutes {
  static get(): AppRoutes {
    return [
      {
        path: '/health',
        method: 'GET',
        handler: async () => ({ status: 'Healthy' })
      },
      ...getAuthRoutes(),
      ...getUserRoutes(),
      ...getPostRoutes()
    ];
  }
}
