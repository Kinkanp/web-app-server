import { CreateUserParams } from 'aggregation/users';
import { HttpRequest, HttpResponse, HttpRequestUtil, HttpResponseUtil } from '../../core';
import { UserServiceModel } from './user-service.model';

export class UserController {
  constructor(private userService: UserServiceModel) {
  }

  public async create(req: HttpRequest, res: HttpResponse): Promise<void> {
    const data = await new HttpRequestUtil(req).getData<CreateUserParams>();
    const user = await this.userService.create(data);

    new HttpResponseUtil(res).send(user);
  }

  public async list(req: HttpRequest, res: HttpResponse): Promise<void> {
    const users = await this.userService.list();

    new HttpResponseUtil(res).send(users);
  }

  public async findOne(req: HttpRequest, res: HttpResponse, id: string): Promise<void> {
    const user = await this.userService.findOne(+id);

    new HttpResponseUtil(res).send(user);
  }
}