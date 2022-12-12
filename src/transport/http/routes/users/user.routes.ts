import { Routes } from '../../core';
import { USER_SERVICE, UserModule } from '../../../../aggregation/user';
import { UserController } from './user.controller';
import { IoC } from '../../../../ioc';
import { AUTH_GUARD, AuthGuardModule } from '../../guards';
import { IRequestContextValues } from '../../http.constants';

export function getUserRoutes(): Routes<IRequestContextValues> {
  const service = IoC.injectModule(UserModule).import(USER_SERVICE);
  const controller = new UserController(service);
  const authGuard = IoC.injectModule(AuthGuardModule).import(AUTH_GUARD);

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
