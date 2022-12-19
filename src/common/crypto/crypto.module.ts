import { AppModule } from '@packages/ioc';
import { CryptoService } from './crypto.service';

export const CRYPTO = Symbol('crypto');

export interface ICrypto {
  hash(data: string | Buffer, salt?: number): Promise<string>;
  compare(data: string | Buffer, hashed: string): Promise<boolean>;
}

export class CryptoModule extends AppModule<{ [CRYPTO]: ICrypto }> {
  protected declares = [
    { map: CRYPTO, to: CryptoService }
  ]
  protected exports = [CRYPTO];
}
