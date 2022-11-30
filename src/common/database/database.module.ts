import { Container } from 'inversify';
import { createConnection } from './database-connection';
import { ConfigModule } from '../config';
import { IAppModule } from '../../ioc';
import { DBConnection } from './database.model';

export const DB_CONNECTION = Symbol('DB connection');

export class DatabaseModule extends IAppModule {
  static requires() {
    return [ConfigModule];
  }

  static register(container: Container): void {
    this.container = container;

    const config = ConfigModule.get();
    const connection = createConnection(config.environment.isDev);

    this.container.bind(DB_CONNECTION).toConstantValue(connection);
  }

  static getConnection(): DBConnection {
    return this.container.get(DB_CONNECTION);
  }
}