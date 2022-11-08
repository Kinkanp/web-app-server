import { UserService } from './user.service';
import { HttpRequest, HttpResponse } from '../../common/server';

export class UserController {
  constructor(private userService: UserService) {
  }

  public async create(req: HttpRequest, res: HttpResponse): Promise<void> {
    // const username = req.body;
    console.log(req);
    const user = await this.userService.create('abc');

    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(user))
  }

  public async list(req: HttpRequest, res: HttpResponse): Promise<void> {
    const result = await this.userService.list();
    res.end(JSON.stringify((result as any).fields));
  }

  public async findOne(req: HttpRequest, res: HttpResponse): Promise<void> {
    res.end(JSON.stringify({ username: 'fwkrefjkeriof' }));
  }
}