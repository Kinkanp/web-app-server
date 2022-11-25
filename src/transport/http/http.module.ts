import { Container } from 'inversify';
import { HttpExceptionHandler } from './errors';
import { ExceptionHandler, HttpServer, HttpServerConfig } from './core';
import { APP_CONFIG, AppConfig } from '../../common/config';
import { HTTP_EXCEPTION_HANDLER, HTTP_SERVER_CONFIG } from './core/inversion';
import { IAppModule } from '../../ioc';
import { ConfigModule } from '../../common/config';
import { LoggerModule } from '../../common/logger/logger.module';

export class HttpModule extends IAppModule {
  static requires() {
    return [ConfigModule, LoggerModule];
  }

  static register(container: Container): void {
    this.container = container;

    this.container.bind(HTTP_SERVER_CONFIG).toConstantValue(this.config());
    this.container.bind<ExceptionHandler>(HTTP_EXCEPTION_HANDLER).to(HttpExceptionHandler);
    this.container.bind(HttpServer).toSelf().inSingletonScope();
  }

  static getServer(): HttpServer {
    return this.container.get(HttpServer);
  }

  private static config(): HttpServerConfig {
    const { baseUrl, port } = this.container.get<AppConfig>(APP_CONFIG).app;

    return { baseUrl, port };
  }
}