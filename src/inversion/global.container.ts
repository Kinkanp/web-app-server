import 'reflect-metadata';
import { Container } from 'inversify';
import { DBConnection } from '../common/database';
import { AppConfig } from '../common/config';
import { APP_CONFIG, DB_CONNECTION } from './global.symbols';

export class AppContainer {
  private static container = new Container();

  static set(
    dbConnection: DBConnection,
    appConfig: AppConfig
  ): void  {
    AppContainer.container.bind<DBConnection>(DB_CONNECTION).toConstantValue(dbConnection);
    AppContainer.container.bind<AppConfig>(APP_CONFIG).toConstantValue(appConfig);
  }

  static create(): Container {
    const container = new Container();

    container.parent = AppContainer.container;

    return container;
  }
}
