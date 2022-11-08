import { User } from './user.entity';
import { UserRepository } from './user.repository';

export class UserService {
  constructor(private userRepository: UserRepository) {
  }

  public list(): Promise<User[]> {
    return this.userRepository.list();
  }

  public create(username: string): Promise<User> {
    const user = new User(username);

    return this.userRepository.create(user);
  }
}