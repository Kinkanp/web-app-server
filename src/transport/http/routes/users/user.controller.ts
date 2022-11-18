import { CreateUserParams, User } from 'aggregation/users';
import { HttpRequest, HttpResponse, HttpRequestUtil, HttpResponseUtil } from '../../core';
import { UserServiceModel } from './user-service.model';

export class UserController {
  constructor(private userService: UserServiceModel) {
  }

  public async create(req: HttpRequest): Promise<User> {
    const data = await new HttpRequestUtil(req).getData<CreateUserParams>();

    return this.userService.create(data);
  }

  public async list(req: HttpRequest): Promise<User[]> {
    return this.userService.list();
  }

  public async findOne(req: HttpRequest, res: HttpResponse, id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  public async test(req: HttpRequest, res: HttpResponse): Promise<void> {
    const html = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
      </head>
      <body>
        <h1>Hello</h1>
        <h5>Current time is: ${new Date().toISOString()}</h5>
        <button id="test">Test</button>
        <script>
            const button = document.getElementById('test');
            button.addEventListener('click', () => console.log('hello from the server'));
        </script>
      </body>
      </html>
    `;

    new HttpResponseUtil(res).status(200).contentType('text/html').send(html);
  }
}