import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import {
  AccessTokensResponse,
  AuthServiceHelper,
  LoginParams,
  LoginResponse, RegisterParams,
} from './auth.model';
import { InvalidParamsError } from '../../common/errors';
import { CRYPTO, ICrypto } from '../../common/crypto';
import { AuthRepository } from './auth.repository';
import { excludeFields } from '../../common/utils';
import { AUTH_SERVICE_HELPER, UserPublic } from '../../aggregation/auth';
import { APP_CONFIG, AppConfig } from '../../common/config';
import { Uuid, UUID } from '../../common/uuid';
import { Jwt, JWT } from '../../common/jwt';
import { ILogger, LOGGER } from '../../common/logger';

@injectable()
export class AuthService {
  constructor(
    @inject(APP_CONFIG) private readonly config: AppConfig,
    @inject(CRYPTO) private readonly crypto: ICrypto,
    @inject(LOGGER) private readonly logger: ILogger,
    @inject(UUID) private readonly uuid: Uuid,
    @inject(JWT) private readonly jwt: Jwt,
    @inject(AuthRepository) private readonly authRepository: AuthRepository,
    @inject(new LazyServiceIdentifer(() => AUTH_SERVICE_HELPER)) private readonly helper: AuthServiceHelper
  ) {
  }

  public async login(params: LoginParams, ip: string): Promise<LoginResponse> {
    const user = await this.helper.findUserByUsername(params.username);

    if (!user) {
      this.throwCredentialsError();
    }

    const isCorrectPassword = await this.crypto.compare(params.password, user.password);

    if (!isCorrectPassword) {
      this.throwCredentialsError();
    }

    const { accessToken, refreshToken } = this.createAccessTokens(user.id);

    await this.authRepository.saveRefreshToken({ userId: user.id, refreshToken, ip });

    this.logger.info('Auth', `User ${user.id} login`);

    return {
      user: excludeFields(user, ['password']),
      accessToken,
      refreshToken
    };
  }

  public async refresh(refreshToken: string, ip: string): Promise<AccessTokensResponse> {
    const session = await this.authRepository.findSessionByRefreshToken(refreshToken);

    if (!session) {
      this.logger.info('Auth', 'Attempt to use invalid refresh token');
      this.throwCredentialsError();
    }

    await this.authRepository.deleteSession({
      userId: session.userId,
      refreshToken: session.refreshToken
    });

    const newTokens = await this.createAccessTokens(session.userId);

    await this.authRepository.saveRefreshToken({
      userId: session.userId,
      refreshToken: newTokens.refreshToken,
      ip
    });

    this.logger.info('Auth', `User ${session.userId} has used refreshed token`);

    return newTokens;
  }

  public register(params: RegisterParams): Promise<UserPublic> {
    return this.helper.createUser(params);
  }

  public async authenticate(accessToken: string): Promise<UserPublic | null> {
    try {
      const { userId } = this.jwt.verify(accessToken, this.config.app.jwtSecret) as { userId: number };

      if (!userId || typeof userId !== 'number') {
        return null;
      }

      return this.helper.findUserById(userId);
    } catch(e) {
      return null;
    }
  }

  public logout(user: UserPublic): Promise<void> {
    this.logger.info('Auth', `User ${user.id} logout`);

    return this.authRepository.deleteSessions(user.id);
  }

  private throwCredentialsError(): never {
    throw new InvalidParamsError('Invalid credentials');
  }

  private createAccessTokens(userId: number): AccessTokensResponse {
    return {
      refreshToken: this.uuid.v4(),
      accessToken: this.jwt.sign(
        { userId },
        this.config.app.jwtSecret, { expiresIn: this.config.app.jwtExpiresIn }
      )
    };
  }
}
