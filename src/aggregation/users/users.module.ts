import { UserRepository } from '../../domain/user/user.repository';
import { UserService } from '../../domain/user/user.service';
import { Container } from 'inversify';
import { DatabaseModule } from '../../common/database';
import { IAppModule } from '../../ioc';
import { LoggerModule } from '../../common/logger';

export class UsersModule extends IAppModule {
  static requires() {
    return [LoggerModule, DatabaseModule];
  }

  static register(container: Container): void {
    this.container = container;
    this.container.bind(UserRepository).toSelf();
    this.container.bind(UserService).toSelf();
  }

  public static get service(): UserService {
    return this.container.get(UserService);
  }
}
