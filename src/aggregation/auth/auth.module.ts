import { AppModule, IoC } from '../../ioc';
import { AuthRepository, AuthService, AuthServiceHelper } from '../../domain/auth';
import { USER_SERVICE, UserModule } from '../user';
import { LoggerModule } from '../../common/logger';
import { DatabaseModule } from '../../common/database';
import { CryptoModule } from '../../common/crypto';
import { ConfigModule } from '../../common/config';
import { UuidModule } from '../../common/uuid';
import { JwtModule } from '../../common/jwt';

export const AUTH_SERVICE_HELPER = Symbol('Auth service helper');
export const AUTH_SERVICE = Symbol('Auth service');

interface Exports {
  [AUTH_SERVICE]: AuthService;
}

export class AuthModule extends AppModule<Exports> {
  protected imports = [
    CryptoModule,
    LoggerModule,
    DatabaseModule,
    ConfigModule,
    UuidModule,
    JwtModule,
  ];
  protected exports = [AUTH_SERVICE];

  public register(): void {
    this.bind(AuthRepository).toSelf();
    this.bind(AUTH_SERVICE).to(AuthService);
    this.bind<AuthServiceHelper>(AUTH_SERVICE_HELPER).toConstantValue(this.helper);
  }

  private get helper(): AuthServiceHelper {
    const userService = IoC.injectModule(UserModule).import(USER_SERVICE);

    return {
      findUserByUsername: (username) => userService.findByUsername(username),
      findUserById: (id) => userService.findOne(id),
      createUser: (params) => userService.create(params)
    };
  }
}
