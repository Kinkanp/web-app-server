import 'reflect-metadata';
import { HttpRoutes } from './transport/http/routes';
import { HTTP_SERVER, HttpModule } from './transport/http';
import { UserModule } from './aggregation/user';
import { DatabaseModule, DB_CONNECTION } from './common/database';
import { ConfigModule } from './common/config';
import { logErrorToConsole, LoggerModule } from './common/logger';
import { AuthModule } from './aggregation/auth';
import { CryptoModule } from './common/crypto';
import { UuidModule } from './common/uuid';
import { JwtModule } from './common/jwt';
import { getGuardModules } from './transport/http/guards';
import { injectModule, registerModules } from '@packages/ioc';
import { Routes } from '@packages/http-server';
import { PostModule } from './aggregation/post';

export class App {
  static {
    try {
      this.init();
      this.run();
    } catch (e) {
      logErrorToConsole('App unhandled exception', e);
      this.shutdown();
    }
  }

  static shutdown(): Promise<void[]> {
    const server = injectModule(HttpModule).import(HTTP_SERVER);
    const dbConnection = injectModule(DatabaseModule).import(DB_CONNECTION);

    return Promise.all([
      server.close(),
      dbConnection.$disconnect()
    ]);
  }

  private static init(): void {
    registerModules([
      //Small utils
      CryptoModule,
      UuidModule,
      JwtModule,
      // Common
      LoggerModule,
      ConfigModule,
      DatabaseModule,
      HttpModule,
      ...getGuardModules(),
      // Domain
      UserModule,
      AuthModule,
      PostModule
    ]);
  }

  private static run(): void {
    const server = injectModule(HttpModule).import(HTTP_SERVER);
    const routes = HttpRoutes.get();

    server.create().listen(routes as Routes);
  }
}
