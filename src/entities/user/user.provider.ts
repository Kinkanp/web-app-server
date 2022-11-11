import { EntityProvider } from '../../common/provider';
import { UserRepository } from './user.repository';
import { DBConnection } from '../../common/database';
import { UserService } from './user.service';
import { UserController } from './user.controller';

export class UserProvider implements EntityProvider {
  public controller: UserController;
  public service: UserService;
  public repository: UserRepository;

  public async init(connection: DBConnection): Promise<void> {
    this.repository = new UserRepository(connection);
    this.service = new UserService(this.repository);
    this.controller = new UserController(this.service);

    return this.repository.init();
  }
}
