import { HttpRequest, HttpRequestUtil } from '@packages/http-server';
import {
  AccessTokensResponse,
  LoginParams,
  LoginResponse,
  RegisterParams,
  UserPublic
} from '../../../../aggregation/auth';
import { Validator } from '../../../../common/validation';

interface AuthServiceModel {
  login(params: LoginParams): Promise<LoginResponse>;
  refresh(refreshToken: string): Promise<AccessTokensResponse>;
  register(params: RegisterParams): Promise<UserPublic>;
  logout(user: UserPublic): Promise<void>;
}

export class AuthController {
  constructor(private authService: AuthServiceModel) {
  }

  public async login(req: HttpRequest): Promise<LoginResponse> {
    const params = await new HttpRequestUtil(req).getData<LoginParams>();
    const { username, password } = Validator.requiredObject<LoginParams>(params, {
      username: { type: 'string' },
      password: { type: 'string' },
    });

    return this.authService.login({ username, password });
  }

  public async refresh(req: HttpRequest): Promise<AccessTokensResponse> {
    const params = await new HttpRequestUtil(req).getData();
    const { refreshToken } = Validator.requiredObject<{ refreshToken: string }>(params, {
      refreshToken: { type: 'string' }
    });

    return this.authService.refresh(refreshToken);
  }

  public async register(req: HttpRequest): Promise<UserPublic> {
    const params = await new HttpRequestUtil(req).getData<RegisterParams>();
    const { username, password } = Validator.requiredObject<RegisterParams>(params, {
      username: { type: 'string' },
      password: { type: 'string' },
    })

    return this.authService.register({ username, password });
  }

  public logout(user: UserPublic): Promise<void> {
    return this.authService.logout(user);
  }
}
