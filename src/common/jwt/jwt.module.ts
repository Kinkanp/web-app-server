import { AppModule } from '@packages/ioc';
import * as jsonwebtoken from 'jsonwebtoken';
import { JwtPayload, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';

export const JWT = Symbol('jwt');

export interface Jwt {
  sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: Secret,
    options?: SignOptions,
  ): string,
  verify(
    token: string,
    secretOrPublicKey: Secret,
    options?: VerifyOptions
  ): Jwt | JwtPayload | string;
}

export class JwtModule extends AppModule {
  protected exports = [JWT];

  public register(): void {
    this.bind<Jwt>(JWT).toConstantValue({
      sign: (...params) => jsonwebtoken.sign(...params),
      verify: (...params) => jsonwebtoken.verify(...params),
    });
  }
}
