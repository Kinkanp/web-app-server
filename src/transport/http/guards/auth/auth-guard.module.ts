import { AppModule, IoC } from '../../../../ioc';
import { AUTH_SERVICE, AuthModule } from '../../../../aggregation/auth';
import { AuthGuard, AuthGuardHelper } from '../../index';

export const AUTH_GUARD = Symbol('auth guard');
export const AUTH_GUARD_HELPER = Symbol('auth guard helper');

export class AuthGuardModule extends AppModule<{ [AUTH_GUARD]: AuthGuard }> {
  protected imports = [AuthModule];
  protected exports = [AUTH_GUARD];

  public register(): void {
    this.bind(AUTH_GUARD).to(AuthGuard)
    this.bind<AuthGuardHelper>(AUTH_GUARD_HELPER).toConstantValue(this.helper);
  }

  private get helper(): AuthGuardHelper {
    const authService = IoC.injectModule(AuthModule).import(AUTH_SERVICE);

    return {
      authenticate: (accessToken: string) => authService.authenticate(accessToken)
    };
  }
}
