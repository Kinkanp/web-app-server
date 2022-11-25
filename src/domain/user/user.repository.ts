import { User } from './user.entity';
import { DB_CONNECTION, DBConnection } from '../../common/database';
import { CreateUserParams } from './user.models';
import { inject, injectable } from 'inversify';
import { USER_SCHEMA, USER_TABLE_OPTIONS } from './user.schema';

@injectable()
export class UserRepository {
  constructor(@inject(DB_CONNECTION) private connection: DBConnection) {
    User.setupEntity(USER_SCHEMA, USER_TABLE_OPTIONS, connection);
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

  public findOne(id: number): Promise<User | null> {
    return User.findByPk(id);
  }
}