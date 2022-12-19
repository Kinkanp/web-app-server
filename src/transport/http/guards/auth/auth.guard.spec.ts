import 'reflect-metadata';
import { describe, expect, test, vitest } from 'vitest';
import { createTestingModule } from '@packages/ioc';
import { AuthGuard, AuthGuardHelper } from './auth.guard';
import { AUTH_GUARD, AUTH_GUARD_HELPER } from './auth-guard.module';
import { RequestContextValues } from '../../http.constants';
import { GuardParams, HttpRequest, RequestContext } from '@packages/http-server';
import { UnauthorizedError } from '../../../../common/errors';

const createAuthGuard = (helper: AuthGuardHelper) => {
  const module =  createTestingModule(() => ({
    exports: [AUTH_GUARD],
    declare: [
      { map: AUTH_GUARD, to: AuthGuard },
      { map: AUTH_GUARD_HELPER, to: helper }
    ]
  }));

  return module.import(AUTH_GUARD) as AuthGuard;
};

const createGuardParams = (token = '') => {
  const authorization = `Bearer ${token}`;
  const params = {
    context: new RequestContext(),
    req: { headers: { authorization } } as HttpRequest
  } as GuardParams<RequestContextValues>;

  return { params, token };
}

describe('auth guard', () => {
  test('should throw 401 error with no authorisation header provided', async () => {
    const { params } = createGuardParams();
    const authenticate = vitest.fn().mockReturnValue(Promise.resolve(null));
    const guard = createAuthGuard({ authenticate: () => Promise.resolve(null) });

    const contextSet = vitest.spyOn(params.context, 'set')

    try {
      await guard.allow(params);
    } catch(error) {
      expect(error instanceof UnauthorizedError).toBeTruthy();
    }
    expect(contextSet).not.toHaveBeenCalled();
    expect(authenticate).not.toHaveBeenCalled();
  });

  test('should throw 401 error when authentication fails', async () => {
    const { params, token } = createGuardParams('token');
    const authenticate = vitest.fn().mockReturnValue(Promise.resolve(null));
    const guard = createAuthGuard({ authenticate });
    const contextSet = vitest.spyOn(params.context, 'set')

    try {
      await guard.allow(params);
    } catch(error) {
      expect(error instanceof UnauthorizedError).toBeTruthy();
    }
    expect(authenticate).toHaveBeenCalledWith(token);
    expect(contextSet).not.toHaveBeenCalled();
  });


  test('should set user to the request context', async () => {
    const { params, token } = createGuardParams('token');
    const user = { id: 1 };
    const authenticate = vitest.fn().mockReturnValue(Promise.resolve(user));
    const guard = createAuthGuard({ authenticate });
    const contextSet = vitest.spyOn(params.context, 'set')

    await guard.allow(params);

    expect(authenticate).toHaveBeenCalledWith(token);
    expect(contextSet).toHaveBeenCalledWith('user', user);
  });
});
