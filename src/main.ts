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
    try {
      this.register();
      this.start()
    } catch {
      this.shutdown();
    }
  }

  static shutdown(): Promise<void[]> {
    return Promise.all([
      HttpModule.getServer().close(),
      DatabaseModule.getConnection().$disconnect()
    ]);
  }

  private static register(): void {
    AppModule.register([
      LoggerModule,
      ConfigModule,
      DatabaseModule,
      HttpModule,
      UsersModule
    ]);
  }

  private static start(): void {
    HttpModule.getServer().setRoutes(HttpRoutes.get()).create().listen();
  }
}
