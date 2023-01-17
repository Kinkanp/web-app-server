import { inject, injectable } from 'inversify';
import { DB_CONNECTION, DBConnection } from '../../common/database';
import { Session } from './auth.model';

@injectable()
export class AuthRepository {
  constructor(@inject(DB_CONNECTION) private connection: DBConnection) {}

  public saveRefreshToken(data: { userId: number; refreshToken: string, ip: string }): Promise<Session> {
    return this.connection.sessionModel.create({ data });
  }

  public findSessionByRefreshToken(refreshToken: string): Promise<Session | null> {
    return this.connection.sessionModel.findFirst({
      where: { refreshToken }
    });
  }

  public deleteSession(params: Pick<Session, 'userId' | 'refreshToken'>): Promise<Session | null> {
    return this.connection.sessionModel.delete({
      where: {
        userId_refreshToken: params
      }
    });
  }

  public async deleteSessions(userId: number): Promise<void> {
    await this.connection.sessionModel.deleteMany({ where: { userId } });
  }
}
