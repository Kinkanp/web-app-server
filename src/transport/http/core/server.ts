import * as http from 'http';
import { inject, injectable } from 'inversify';
import { HttpServerConfig, HttpRequest, HttpResponse, ExceptionHandler } from './server.model';
import { RouteDynamicParams, RouteHandler, Routes } from './routing/routing.model';
import { HttpRouting } from './routing/routing';
import { ClientErrorResponse, InternalErrorResponse, SuccessResponse } from './responses';
import { ILogger, LOGGER } from '../../../common/logger';
import { HTTP_EXCEPTION_HANDLER, HTTP_SERVER_CONFIG } from './inversion';

@injectable()
export class HttpServer {
  private server: http.Server;
  private routing: HttpRouting;

  constructor(
    @inject(HTTP_EXCEPTION_HANDLER) private exceptionHandler: ExceptionHandler,
    @inject(HTTP_SERVER_CONFIG) private config: HttpServerConfig,
    @inject(LOGGER) private logger: ILogger
  ) {
  }

  public get(): http.Server {
    return this.server;
  }

  public create(): HttpServer {
    this.server = http.createServer((req, res) => this.handleRequest(req, res));

    return this;
  }

  public close(): Promise<void> {
    return new Promise(resolve => {
      this.server.close(() => resolve());
    });
  }

  public listen(): void {
    this.server.listen(this.config.port, () => {
      // TODO: set domain instead of localhost
      this.logger.info(`Server is running on: http://localhost:${this.config.port}`);
    });
  }

  public setRoutes(routes: Routes): this {
    this.routing = new HttpRouting(routes, this.config.baseUrl);

    return this;
  }

  private async handleRequest(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { handler, dynamicParams } = this.routing.match(req);

    if (handler) {
      await this.handleRouteResponse(handler, req, res, dynamicParams);
    } else {
      new ClientErrorResponse(res).status(404).message('Not Found').send();
    }
  }

  private async handleRouteResponse(
    handler: RouteHandler,
    req: HttpRequest,
    res: HttpResponse,
    dynamicParams: RouteDynamicParams
  ): Promise<void> {
    try {
      const data = await handler(req, res, dynamicParams);

      if (data) {
        new SuccessResponse(res).status(200).send(data);
      }
    } catch (error) {
      this.handleRouteError(res, error as Error);
    }
  }

  private handleRouteError(res: HttpResponse, error: Error): void {
    if (!this.exceptionHandler) {
      this.throwInternalError(res);
    }

    try {
      this.exceptionHandler.handle(res, error);
    } catch {
      this.throwInternalError(res);
    }
  }

  private throwInternalError(res: HttpResponse): void {
    new InternalErrorResponse(res).status(500).send();
  }
}
