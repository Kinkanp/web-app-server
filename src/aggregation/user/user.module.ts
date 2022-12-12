import { UserRepository } from '../../domain/user/user.repository';
import { UserService } from '../../domain/user/user.service';
import { DatabaseModule } from '../../common/database';
import { AppModule } from '../../ioc';
import { LoggerModule } from '../../common/logger';
import { CryptoModule } from '../../common/crypto';

export const USER_SERVICE = Symbol('App User service');

export class UserModule extends AppModule<{ [USER_SERVICE]: UserService }> {
  protected imports = [LoggerModule, DatabaseModule, CryptoModule];
  protected exports = [USER_SERVICE];

  public register(): void {
    this.bind(UserRepository).toSelf();
    this.bind(USER_SERVICE).to(UserService);
  }
}
