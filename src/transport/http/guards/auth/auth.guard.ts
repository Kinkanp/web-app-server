import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { Guard, GuardParams } from '@packages/http-server';
import { AUTH_GUARD_HELPER } from '../index';
import { UnauthorizedError } from '../../../../common/errors';
import { UserPublic } from '../../../../aggregation/user';
import { IRequestContextValues } from '../../http.constants';

export interface AuthGuardHelper {
  authenticate(accessToken: string): Promise<UserPublic | null>;
}

@injectable()
export class AuthGuard implements Guard {
  constructor(@inject(new LazyServiceIdentifer(() => AUTH_GUARD_HELPER)) private helper: AuthGuardHelper) {}

  public async allow({ req, context }: GuardParams<IRequestContextValues>): Promise<void> {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new UnauthorizedError();
    }

    const bearer = 'Bearer ';
    const user = await this.helper.authenticate(accessToken.substring(bearer.length));

    if (!user) {
      throw new UnauthorizedError();
    } else {
      context.set('user', user);
    }
  }
}
