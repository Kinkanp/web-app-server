import { AppContainer } from '../../inversion';
import { UserRepository } from '../../domain/user/user.repository';
import { UserService } from '../../domain/user/user.service';
import { Container } from 'inversify';

export class UsersAggregator {
  private static container: Container;

  public static init(): void {
    UsersAggregator.container = AppContainer.create();

    UsersAggregator.container.bind<UserRepository>(UserRepository).toSelf();
    UsersAggregator.container.bind<UserService>(UserService).toSelf();
  }

  public static get service(): UserService {
    return UsersAggregator.container.get(UserService);
  }
}

UsersAggregator.init();