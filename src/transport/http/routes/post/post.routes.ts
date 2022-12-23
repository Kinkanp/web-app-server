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
      guards: [authGuard],
      handler: ({ context }) => controller.list(context.get('user'))
    },
    {
      path: '/posts',
      method: 'POST',
      guards: [authGuard],
      handler: ({ req, context }) => controller.create(req, context.get('user'))
    },
    {
      path: '/posts/:id',
      method: 'PATCH',
      guards: [authGuard],
      handler: ({ req, params, context }) => controller.update(req, params[0], context.get('user'))
    },
    {
      path: '/posts/:id',
      method: 'GET',
      guards: [authGuard],
      handler: ({ params, context }) => controller.one(params[0], context.get('user'))
    },
    {
      path: '/posts/:id',
      method: 'DELETE',
      guards: [authGuard],
      handler: ({ params, context }) => controller.delete(params[0], context.get('user'))
    }
  ]
}
