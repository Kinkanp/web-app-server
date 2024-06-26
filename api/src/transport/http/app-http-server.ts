import * as http from 'http';
import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { IAppLogger, LOGGER } from '../../common/logger';
import {
  HttpServer,
  HttpServerConfig,
  Routes
} from '@packages/http-server';
import { APP_CONFIG, AppConfig } from '../../common/config';
import { AppHttpExceptionHandler } from './http-exception-handler';
import { HTTP_EXCEPTION_HANDLER } from './http.module';
import { HttpCacheInterceptor } from './http-cache-interceptor';

@injectable()
export class AppHttpServer {
  private server: HttpServer;

  constructor(
    @inject(APP_CONFIG) private config: AppConfig,
    @inject(LOGGER) private logger: IAppLogger,
    @inject(HttpCacheInterceptor) private httpCacheInterceptor: HttpCacheInterceptor,
    @inject(new LazyServiceIdentifer(() => HTTP_EXCEPTION_HANDLER)) private exceptionHandler: AppHttpExceptionHandler,
  ) {
  }

  public create(): this {
    const config = this.createConfig();
    this.server = this.createServer(config);

    return this;
  }

  public async start(routes: Routes): Promise<void> {
    await this.server
      .setLogger(this.logger)
      .setRoutes(routes)
      .setExceptionHandler(this.exceptionHandler)
      .setRequestInterceptor(this.httpCacheInterceptor)
      .create()
      .listen();

    this.logger.info(`Server is running on: http://127.0.0.1:${this.config.app.port}, Base url: ${this.config.app.baseUrl}`);
  }

  public async close(): Promise<void> {
    if (!this.server) {
      this.logger.debug('Attempt to close not started server');
      return;
    }

    return this.server.close();
  }

  public get(): http.Server {
    return this.server.get();
  }

  private createConfig(): HttpServerConfig {
    const { port, baseUrl } = this.config.app;
    return { port, baseUrl };
  }

  private createServer(config: HttpServerConfig): HttpServer {
    return new HttpServer(config);
  }
}
