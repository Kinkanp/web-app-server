import 'reflect-metadata';
import { HttpRoutes } from './transport/http/routes';
import { AppModule } from './ioc';
import { HttpModule } from './transport/http';
import { UsersModule } from './aggregation/users';
import { DatabaseModule } from './common/database';
import { ConfigModule } from './common/config';
import { LoggerModule } from './common/logger';

export class App {
  static {
    AppModule.register([
      LoggerModule,
      ConfigModule,
      DatabaseModule,
      HttpModule,
      UsersModule
    ]);

    HttpModule.getServer().setRoutes(HttpRoutes.get()).create().listen();
  }

  static shutdown(): Promise<void[]> {
    return Promise.all([HttpModule.getServer().close(), DatabaseModule.getConnection().close()]);
  }
}
