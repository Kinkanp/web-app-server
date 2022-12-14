import 'reflect-metadata';
import { HttpRoutes } from './transport/http/routes';
import { HTTP_SERVER, HttpModule } from './transport/http';
import { UserModule } from './aggregation/user';
import { DatabaseModule, DB_CONNECTION } from './common/database';
import { ConfigModule } from './common/config';
import { logError, LoggerModule } from './common/logger';
import { AuthModule } from './aggregation/auth';
import { CryptoModule } from './common/crypto';
import { UuidModule } from './common/uuid';
import { JwtModule } from './common/jwt';
import { getGuardModules } from './transport/http/guards';
import { injectModule, registerModules } from '@packages/ioc';
import { Routes } from '@packages/http-server';

export class App {
  static {
    try {
      this.register();
      this.start();
    } catch (e) {
      logError('App unhandled exception', e);
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

  private static register(): void {
    // TODO: separate registration for domain and common ?
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
    ]);
  }

  private static start(): void {
    const server = injectModule(HttpModule).import(HTTP_SERVER);
    const routes = HttpRoutes.get();

    server.create().listen(routes as Routes);
  }
}
