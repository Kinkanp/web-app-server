import { User, UserPublic } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserParams } from './user.models';
import { inject, injectable } from 'inversify';
import { InvalidParamsError, NotFoundError } from '../../common/errors';
import { Validator } from '../../common/validation';
import { UserValidationSchemas } from './user-validation.schemas';
import { ILogger, LOGGER } from '../../common/logger';
import { CRYPTO, ICrypto } from '../../common/crypto';
import { excludeFields } from '../../common/utils';

@injectable()
export class UserService {
  private exclude: Array<keyof Pick<User, 'password'>> = ['password'];

  constructor(
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(LOGGER) private logger: ILogger,
    @inject(CRYPTO) private crypto: ICrypto,
  ) {
  }

  public async list(): Promise<UserPublic[]> {
    const users = await this.userRepository.list();

    this.logger.info('User', 'list');
    return excludeFields(users, this.exclude);
  }

  public async create(params: CreateUserParams): Promise<UserPublic> {
    const { errors, data } = Validator.validate<Defined<CreateUserParams>>(UserValidationSchemas.create, params);

    if (errors) {
      throw new InvalidParamsError(errors);
    }

    const user = await this.userRepository.findOne({ username: data.username });

    if (user) {
      throw new InvalidParamsError('User with such username already exists');
    }

    const newUser = {
      username: data.username,
      password: await this.crypto.hash(data.password)
    };

    const createdUser = await this.userRepository.create(newUser);
    this.logger.info('User', `create: ${createdUser.username}`);

    return excludeFields(createdUser, this.exclude);
  }

  public async findOne(id: number): Promise<UserPublic> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundError(`User with id "${id}" doesn't exist`);
    }

    this.logger.info('User', `findOne: ${id}`);
    return excludeFields(user, this.exclude)
  }

  public findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ username });
  }
}
