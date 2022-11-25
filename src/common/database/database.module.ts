import { Container } from 'inversify';
import { createConnection } from './database-connection';
import { APP_CONFIG, AppConfig, ConfigModule } from '../config';
import { IAppModule } from '../../ioc';
import { DBConnection } from './database.model';

export const DB_CONNECTION = Symbol('DB connection');

export class DatabaseModule extends IAppModule {
  static requires() {
    return [ConfigModule];
  }

  static register(container: Container): void {
    this.container = container;

    const config = container.get<AppConfig>(APP_CONFIG);
    const connection = createConnection(config.database);

    this.container.bind(DB_CONNECTION).toConstantValue(connection);
  }

  static getConnection(): DBConnection {
    return this.container.get(DB_CONNECTION);
  }
}