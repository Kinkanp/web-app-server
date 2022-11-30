import { CreateUserParams, User } from '../../../../aggregation/users';
import { HttpRequest, HttpResponse, HttpRequestUtil } from '../../core';
import { UserServiceModel } from './user-service.model';

export class UserController {
  constructor(private userService: UserServiceModel) {
  }

  public async create(req: HttpRequest): Promise<User> {
    const { firstName, lastName } = await new HttpRequestUtil(req).getData<CreateUserParams>();

    return this.userService.create({ firstName, lastName });
  }

  public async list(req: HttpRequest): Promise<User[]> {
    return this.userService.list();
  }

  public async findOne(req: HttpRequest, res: HttpResponse, id: string): Promise<User> {
    return this.userService.findOne(+id);
  }
}