import { User } from './user.entity';
import { Connection } from '../../common/database/database.model';

export class UserRepository {
  constructor(private connection: Connection) {
  }

  public async list(): Promise<User[]> {
    return this.connection.query('select * from users') as unknown as User[];
  }

  public async create(user: User): Promise<User> {
    return this.connection.query<User>('INSERT INTO users VALUES ($)', [user.username])
        .then(() => user);
  }
}