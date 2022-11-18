import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserParams } from './user.models';
import { inject, injectable } from 'inversify';
import { InvalidParamsError } from '../../common/validation/errors';

@injectable()
export class UserService {
  constructor(@inject(UserRepository) private userRepository: UserRepository) {
  }

  public list(): Promise<User[]> {
    return this.userRepository.list();
  }

  public create(params: Required<CreateUserParams>): Promise<User> {
    const isValid = true;

    if (isValid) {
      return this.userRepository.create(params);
    } else {
      throw new InvalidParamsError('`id` is invalid');
    }
  }

  public findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }
}
