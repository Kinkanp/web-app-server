import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserParams } from './user.models';
import { inject, injectable } from 'inversify';

@injectable()
export class UserService {
  constructor(@inject(UserRepository) private userRepository: UserRepository) {
  }

  public list(): Promise<User[]> {
    return this.userRepository.list();
  }

  public create(params: Required<CreateUserParams>): Promise<User> {
    return this.userRepository.create(params);
  }

  public findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }
}