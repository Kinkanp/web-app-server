import { User } from './user.entity';
import { DB_CONNECTION, DBConnection } from '../../common/database';
import { CreateUserParams } from './user.models';
import { inject, injectable } from 'inversify';

@injectable()
export class UserRepository {
  constructor(@inject(DB_CONNECTION) private connection: DBConnection) {
  }

  public async list(): Promise<User[]> {
    return this.connection.userModel.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  public async create(data: CreateUserParams): Promise<User> {
    return this.connection.userModel.create({ data });
  }

  public async findOne(id: number): Promise<User | null> {
    return this.connection.userModel.findUnique({
      where: { id }
    });
  }
}
