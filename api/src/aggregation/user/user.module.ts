import { UserRepository } from '../../domain/user/user.repository';
import { UserService } from '../../domain/user/user.service';
import { DatabaseModule } from '../../common/database';
import { AppModule } from '@packages/ioc';
import { LoggerModule } from '../../common/logger';
import { CryptoModule } from '../../common/crypto';
import { UserValidator } from '../../domain/user/user-validator';

export const USER_SERVICE = Symbol('App User service');

export class UserModule extends AppModule<{ [USER_SERVICE]: UserService }> {
  imports = [LoggerModule, DatabaseModule, CryptoModule];
  exports = [USER_SERVICE];
  declares  = [
    UserRepository,
    UserValidator,
    { map: USER_SERVICE, to: UserService }
  ];
}
