import 'reflect-metadata';
import { HTTP_SERVER, HttpModule, ControllersModule } from './transport/http';
import { UserModule } from './aggregation/user';
import { DatabaseModule, DB_CONNECTION } from './common/database';
import { ConfigModule } from './common/config';
import { LoggerModule } from './common/logger';
import { AuthModule } from './aggregation/auth';
import { CryptoModule } from './common/crypto';
import { UuidModule } from './common/uuid';
import { JwtModule } from './common/jwt';
import { PostModule } from './aggregation/post';
import { getGuardModules } from './transport/http/guards';
import { injectModule, registerModules } from '@packages/ioc';
import { Routes } from '@packages/http-server';
import { logErrorToConsole } from '@packages/logger';
import { CacheModule } from './common/caching/cache.module';

export class App {
  static {
    try {
      this.init()
        .then(() => this.run());
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

  private static init(): Promise<void> {
    return registerModules([
      //Small utils
      CryptoModule,
      UuidModule,
      JwtModule,
      // Common
      LoggerModule,
      ConfigModule,
      DatabaseModule,
      HttpModule,
      ControllersModule,
      CacheModule,
      ...getGuardModules(),
      // Domain
      UserModule,
      AuthModule,
      PostModule
    ]);
  }

  private static run(): void {
    const server = injectModule(HttpModule).import(HTTP_SERVER);
    const routes = injectModule(ControllersModule).getRoutes();

    server.create().start(routes as Routes);
  }
}
