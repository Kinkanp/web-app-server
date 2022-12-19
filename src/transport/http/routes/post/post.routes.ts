import { injectModule } from '@packages/ioc';
import { POST_SERVICE, PostModule } from '../../../../aggregation/post';
import { PostController } from './post.controller';
import { AUTH_GUARD, AuthGuardModule } from '../../guards';
import { AppRoutes } from '../../http.constants';

export function getPostRoutes(): AppRoutes {
  const service = injectModule(PostModule).import(POST_SERVICE);
  const controller = new PostController(service);
  const authGuard = injectModule(AuthGuardModule).import(AUTH_GUARD);

  return [
    {
      path: '/posts',
      method: 'GET',
      handler: () => controller.list()
    },
    {
      path: '/posts',
      method: 'POST',
      guards: [authGuard],
      handler: ({ req, context }) => controller.create(req, context.get('user'))
    }
  ]
}
