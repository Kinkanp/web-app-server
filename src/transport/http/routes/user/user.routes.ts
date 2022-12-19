import { USER_SERVICE, UserModule } from '../../../../aggregation/user';
import { UserController } from './user.controller';
import { injectModule } from '@packages/ioc';
import { AUTH_GUARD, AuthGuardModule } from '../../guards';
import { AppRoutes } from '../../http.constants';

export function getUserRoutes(): AppRoutes {
  const service = injectModule(UserModule).import(USER_SERVICE);
  const authGuard = injectModule(AuthGuardModule).import(AUTH_GUARD);
  const controller = new UserController(service);

  return [
    {
      path: '/users',
      method: 'GET',
      handler: () => controller.list()
    },
    {
      path: '/users/current',
      method: 'GET',
      guards: [authGuard],
      handler: ({ context }) => controller.current(context.get('user'))
    },
    {
      path: '/users/:id',
      method: 'GET',
      handler: ({ req, res, params }) => controller.one(req, res, params[0])
    },
  ];
}
