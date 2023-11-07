import { HttpRequest, HttpResponse } from '@packages/http-server';
import { USER_SERVICE, UserPublic } from '../../../aggregation/user';
import { AppController, AppRoutes } from '../http.constants';
import { Validator } from '../../../common/validation';
import { AUTH_GUARD } from '../guards';
import { inject, injectable } from 'inversify';
import { AuthGuard } from '../guards/auth/auth.guard';

interface UserServiceModel {
  list(): Promise<UserPublic[]>;
  findOne(id: number): Promise<UserPublic>;
}

@injectable()
export class UserController implements AppController {
  constructor(
    @inject(USER_SERVICE) private userService: UserServiceModel,
    @inject(AUTH_GUARD) private authGuard: AuthGuard
  ) {
  }

  public getRoutes(): AppRoutes {
    return [
      {
        path: '/users',
        method: 'GET',
        handler: () => this.list()
      },
      {
        path: '/users/current',
        method: 'GET',
        guards: [this.authGuard],
        handler: ({ context }) => this.current(context.get('user'))
      },
      {
        path: '/users/:id',
        method: 'GET',
        handler: ({ req, res, params }) => this.one(req, res, params[0])
      },
    ];
  }

  public async list(): Promise<UserPublic[]> {
    return this.userService.list();
  }

  public async one(req: HttpRequest, res: HttpResponse, id: string): Promise<UserPublic> {
    const userId = Validator.id(id);

    return this.userService.findOne(userId);
  }

  public async current(user: UserPublic): Promise<UserPublic> {
    return user;
  }
}
