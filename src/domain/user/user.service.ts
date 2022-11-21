import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserParams } from './user.models';
import { inject, injectable } from 'inversify';
import { InvalidParamsError, NotFoundError } from '../../common/errors';
import { Validator } from '../../common/validation';
import { UserValidationSchemas } from './user-validation.schemas';
import { LOGGER } from '../../inversion';
import { ILogger } from '../../common/logger';

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(LOGGER) private logger: ILogger
  ) {
  }

  public list(): Promise<User[]> {
    this.logger.info('UserService.list');
    return this.userRepository.list();
  }

  public create(params: Required<CreateUserParams>): Promise<User> {
    const errors = Validator.validate(UserValidationSchemas.create, params);

    if (errors) {
      throw new InvalidParamsError(errors);
    }

    this.logger.info(`UserService.create: ${params.firstName}, ${params.lastName}`);
    return this.userRepository.create(params);
  }

  public async findOne(id: number): Promise<User> {
    const errors = Validator.validate(UserValidationSchemas.getOne, id);

    if (errors) {
      throw new InvalidParamsError(errors);
    }

    const user = await this.userRepository.findOne(id);

    if (user) {
      this.logger.info(`UserService.findOne: ${id}`);
      return user;
    }

    throw new NotFoundError(`User with id "${id}" doesn't exist`);
  }
}
