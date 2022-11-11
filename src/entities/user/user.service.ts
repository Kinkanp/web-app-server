import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { EntityService } from '../../common/provider';
import { CreateUserParams } from './user.models';

export class UserService implements EntityService {
  constructor(private userRepository: UserRepository) {
  }

  public list(): Promise<User[]> {
    return this.userRepository.list();
  }

  public create(params: CreateUserParams): Promise<User> {
    return this.userRepository.create(params);
  }

  public findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }
}