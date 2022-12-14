import { Routes } from '@packages/http-server';
import { AUTH_SERVICE, AuthModule } from '../../../../aggregation/auth';
import { AuthController } from './auth.controller';
import { injectModule } from '@packages/ioc';
import { AUTH_GUARD, AuthGuardModule } from '../../guards';
import { IRequestContextValues } from '../../http.constants';

export function getAuthRoutes(): Routes<IRequestContextValues> {
  const authService = injectModule(AuthModule).import(AUTH_SERVICE);
  const auth = new AuthController(authService);
  const authGuard = injectModule(AuthGuardModule).import(AUTH_GUARD);

  return [
    {
      path: '/auth/login',
      method: 'POST',
      handler: ({ req }) => auth.login(req)
    },
    {
      path: '/auth/refresh',
      method: 'POST',
      handler: ({ req }) => auth.refresh(req)
    },
    {
      path: '/auth/register',
      method: 'POST',
      handler: ({ req }) => auth.register(req)
    },
    {
      path: '/auth/logout',
      method: 'POST',
      guards: [authGuard],
      handler: ({ context }) => auth.logout(context.get('user'))
    }
  ];
}
