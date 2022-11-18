import * as http from 'http';
import { HttpServerConfig, HttpRequest, HttpResponse, CustomErrorHandler } from './server.model';
import { RouteDynamicParams, RouteHandler, Routes } from './routing/routing.model';
import { HttpRouting } from './routing/routing';
import { ClientErrorResponse, InternalErrorResponse, SuccessResponse } from './responses';

export class HttpServer {
  private server: http.Server;
  private routing: HttpRouting;
  private exceptionHandler: CustomErrorHandler = () => { throw ''};

  constructor(private config: HttpServerConfig) {}

  public create(): HttpServer {
    this.server = http.createServer((req, res) => this.handleRequest(req, res));

    return this;
  }

  public listen(): Promise<void> {
    return new Promise(resolve => {
      this.server.listen(this.config.port, () => {
        console.log(`Server is running on: http://localhost:${this.config.port}`);
        resolve();
      });
    });
  }

  public setRoutes(routes: Routes): this {
    this.routing = new HttpRouting(routes, this.config.baseUrl);

    return this;
  }

  public setExceptionHandler(handler: CustomErrorHandler): this {
    this.exceptionHandler = handler;

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
    try {
      this.exceptionHandler(res, error);
    } catch {
      new InternalErrorResponse(res).status(500).send();
    }
  }
}
