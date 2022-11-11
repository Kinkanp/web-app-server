import { User } from './user.entity';
import { DBConnection } from '../../common/database';
import { EntityRepository } from '../../common/provider';
import { CreateUserParams } from './user.models';

export class UserRepository implements EntityRepository {
  constructor(private connection: DBConnection) {}

  public async init(): Promise<void> {
    User.setup(this.connection);
    await User.sync();
  }

  public list(): Promise<User[]> {
    return User.findAll({
      order: [
        ['createdAt', 'DESC']
      ]
    });
  }

  public create(params: CreateUserParams): Promise<User> {
    return User.create(params);
  }

  public findOne(id: number): Promise<User> {
    return User.findByPk(id);
  }
}