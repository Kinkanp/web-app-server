import { HttpRequest, HttpRequestUtil } from '@packages/http-server';
import {
  AccessTokensResponse,
  AUTH_SERVICE,
  LoginParams,
  LoginResponse,
  RegisterParams,
  UserPublic
} from '../../../aggregation/auth';
import { Validator } from '../../../common/validation';
import { AppController, AppRoutes } from '../http.constants';
import { inject, injectable } from 'inversify';
import { AUTH_GUARD } from '../guards';
import { AuthGuard } from '../guards/auth/auth.guard';

interface AuthServiceModel {
  login(params: LoginParams, ip: string): Promise<LoginResponse>;
  refresh(refreshToken: string, ip: string): Promise<AccessTokensResponse>;
  register(params: RegisterParams): Promise<UserPublic>;
  logout(user: UserPublic): Promise<void>;
}

@injectable()
export class AuthController implements AppController {
  constructor(
    @inject(AUTH_SERVICE) private authService: AuthServiceModel,
    @inject(AUTH_GUARD) private authGuard: AuthGuard,
  ) {
  }

  public getRoutes(): AppRoutes {
    return [
      {
        path: '/auth/login',
        method: 'POST',
        handler: ({ req, context }) => this.login(req, context.get('ip'))
      },
      {
        path: '/auth/refresh',
        method: 'POST',
        handler: ({ req, context }) => this.refresh(req, context.get('ip'))
      },
      {
        path: '/auth/register',
        method: 'POST',
        handler: ({ req }) => this.register(req)
      },
      {
        path: '/auth/logout',
        method: 'POST',
        guards: [this.authGuard],
        handler: ({ context }) => this.logout(context.get('user'))
      }
    ];
  }

  public async login(req: HttpRequest, ip: string): Promise<LoginResponse> {
    const params = await new HttpRequestUtil(req).getData<LoginParams>();
    const { username, password } = Validator.object<LoginParams>(params, {
      username: { type: 'string' },
      password: { type: 'string' },
    });

    return this.authService.login({ username, password }, ip);
  }

  public async refresh(req: HttpRequest, ip: string): Promise<AccessTokensResponse> {
    const params = await new HttpRequestUtil(req).getData<{ refreshToken: string }>();
    const refreshToken = Validator.string(params.refreshToken);

    return this.authService.refresh(refreshToken, ip);
  }

  public async register(req: HttpRequest): Promise<UserPublic> {
    const params = await new HttpRequestUtil(req).getData<RegisterParams>();
    const { username, password } = Validator.object<RegisterParams>(params, {
      username: { type: 'string' },
      password: { type: 'string' },
    });

    return this.authService.register({ username, password });
  }

  public logout(user: UserPublic): Promise<void> {
    return this.authService.logout(user);
  }
}
