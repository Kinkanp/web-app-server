import { User } from '../user/user.entity';
import { InvalidParamsError } from '../../common/errors';

export class AuthService {
  public async login(): Promise<void> {
    const data = { login: 'test@gmail.com', password: '12345' };
    const user = await this.findUser(data.login);

    if (!user || !this.isValidPassword(data.password)) {
      throw new InvalidParamsError('Wrong credentials');
    }

    const tokens = await this.createTokens(user.id);
  }

  // @ts-ignore
  private async findUser(login: string): User | null {
    // find user by login
  }

  private isValidPassword(password: string): boolean {
    // check if password matched password stored in db
    return false;
  }

  private async createTokens(userId: number): Promise<{ access: string, refresh: string }> {
    // create tokens using jwt.
    // set expires and use secret
    // save tokens to the db
    return { access: '', refresh: '' };
  }
}