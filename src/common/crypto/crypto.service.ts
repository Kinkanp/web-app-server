import * as bcrypt from 'bcrypt';
import { injectable } from 'inversify';

@injectable()
export class CryptoService {
  public compare(data: string | Buffer, hashed: string): Promise<boolean> {
    return bcrypt.compare(data, hashed);
  }

  public hash(data: string | Buffer, salt = 10): Promise<string> {
    return bcrypt.hash(data, salt);
  }
}
