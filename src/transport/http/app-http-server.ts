import * as http from 'http';
import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { ILogger, LOGGER } from '../../common/logger';
import { HttpServer, HttpServerConfig, ExceptionHandler, Routes } from '@packages/http-server';
import { APP_CONFIG, AppConfig } from '../../common/config';
import { HTTP_EXCEPTION_HANDLER } from './http.module';

@injectable()
export class AppHttpServer {
  private server: HttpServer;

  constructor(
    @inject(APP_CONFIG) private config: AppConfig,
    @inject(LOGGER) private logger: ILogger,
    @inject(new LazyServiceIdentifer(() => HTTP_EXCEPTION_HANDLER)) private exceptionHandler: ExceptionHandler,
  ) {
  }

  public create(): this {
    const config = this.createConfig();
    this.server = this.createServer(config);

    return this;
  }

  public async listen(routes: Routes): Promise<void> {
    await this.server
      .setRoutes(routes)
      .setExceptionHandlers(this.exceptionHandler)
      .create()
      .listen();

    this.logger.info(`Server is running on: http://127.0.0.1:${this.config.app.port}`);
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
