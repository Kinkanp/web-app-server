import { UserPublic } from '../../../../aggregation/user';
import { HttpRequest, HttpResponse } from '@packages/http-server';
import { Validator } from '../../../../common/validation';

interface UserServiceModel {
  list(): Promise<UserPublic[]>;
  findOne(id: number): Promise<UserPublic>;
}

export class UserController {
  constructor(private userService: UserServiceModel) {
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
