import { HttpExceptionHandler } from './errors';
import { ExceptionHandler, HttpServer, HttpServerConfig } from './core';
import { APP_CONFIG, AppConfig } from '../../common/config';
import { HTTP_EXCEPTION_HANDLER, HTTP_SERVER_CONFIG } from './core/inversion';
import { AppModule } from '../../ioc';
import { ConfigModule } from '../../common/config';
import { LoggerModule } from '../../common/logger';

export const HTTP_SERVER = Symbol('App http server');

export class HttpModule extends AppModule<{ [HTTP_SERVER]: HttpServer }> {
  protected imports = [ConfigModule, LoggerModule];
  protected exports = [HTTP_SERVER];

  public register(): void {
    const config = this.createConfig();

    this.bind(HTTP_SERVER_CONFIG).toConstantValue(config);
    this.bind<ExceptionHandler>(HTTP_EXCEPTION_HANDLER).to(HttpExceptionHandler);
    this.bind(HTTP_SERVER).to(HttpServer)
  }

  private createConfig(): HttpServerConfig {
    const { baseUrl, port } = this.inject<AppConfig>(APP_CONFIG).app;

    return { baseUrl, port };
  }
}
