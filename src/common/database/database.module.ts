import { createConnection } from './database-connection';
import { APP_CONFIG, AppConfig, ConfigModule } from '../config';
import { AppModule } from '../../ioc';
import { DBConnection } from './database.model';

export const DB_CONNECTION = Symbol('DB connection');

export class DatabaseModule extends AppModule<{ [DB_CONNECTION]: DBConnection }> {
  protected imports = [ConfigModule];
  protected exports = [DB_CONNECTION];

  public register(): void {
    const config = this.inject<AppConfig>(APP_CONFIG);
    const connection = createConnection(config.environment.isDev);

    this.bind(DB_CONNECTION).toConstantValue(connection);
  }
}
