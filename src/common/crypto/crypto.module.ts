import { AppModule } from '../../ioc';
import * as bcrypt from 'bcrypt';

export const CRYPTO = Symbol.for('crypto');

export interface ICrypto {
  hash(data: string | Buffer, salt?: number): Promise<string>;
  compare(data: string | Buffer, hashed: string): Promise<boolean>;
}

export class CryptoModule extends AppModule<{ [CRYPTO]: ICrypto }> {
  protected exports = [CRYPTO];

  public register(): void {
    this.bind<ICrypto>(CRYPTO).toConstantValue({
      compare(data: string | Buffer, hashed: string): Promise<boolean> {
        return bcrypt.compare(data, hashed);
      },
      hash(data: string | Buffer, salt = 10): Promise<string> {
        return bcrypt.hash(data, salt);
      }
    });
  }
}
