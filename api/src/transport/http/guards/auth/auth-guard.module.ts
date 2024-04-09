import { AppModule, injectModule } from '@packages/ioc';
import { AUTH_SERVICE, AuthModule } from '../../../../aggregation/auth';
import { AuthGuard, AuthGuardHelper } from './auth.guard';

export const AUTH_GUARD = Symbol('auth guard');
export const AUTH_GUARD_HELPER = Symbol('auth guard helper');

export class AuthGuardModule extends AppModule<{ [AUTH_GUARD]: AuthGuard }> {
  imports = [AuthModule];
  exports = [AUTH_GUARD];
  declares = [
    { map: AUTH_GUARD, to: AuthGuard },
    {
      map: AUTH_GUARD_HELPER,
      to: () => this.helper
    }
  ];

  private get helper(): AuthGuardHelper {
    const authService = injectModule(AuthModule).import(AUTH_SERVICE);

    return {
      authenticate: (accessToken: string) => authService.authenticate(accessToken)
    };
  }
}
