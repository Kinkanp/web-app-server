import { HttpRequest, HttpResponse, HttpRequestUtil } from '../../../common/http';
import { Controller } from '../../../common/provider';
import { HttpResponseUtil } from '../../../common/http/http-response.util';

export class UserController implements Controller {
  constructor(private userService: UserService) {
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