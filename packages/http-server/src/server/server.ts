import * as http from 'http';
import { HttpServerConfig, HttpRequest, HttpResponse, ExceptionHandler, HttpLogger } from './server.model';
import { RouteDynamicParams, RouteHandler, Routes } from '../routing/routing.model';
import { HttpRouting } from '../routing/routing';
import { ClientErrorResponse, InternalErrorResponse, SuccessResponse } from '../responses';
import { RequestContext } from '../request-context/request-context';
import { v4 as uuidv4 } from 'uuid';

export class HttpServer {
  private server: http.Server;
  private routing: HttpRouting;
  private exceptionHandler: ExceptionHandler;
  private logger?: HttpLogger;

  constructor(private config: HttpServerConfig) {
  }

  public get(): http.Server {
    return this.server;
  }

  public create(): HttpServer {
    this.server = http.createServer((req, res) => this.handleRequest(req, res));
    return this;
  }

  public async close(): Promise<void> {
    return new Promise(resolve => {
      this.server.close(() => resolve());
    });
  }

  public listen(): Promise<void> {
    return new Promise(resolve => {
      this.server.listen(this.config.port, () => resolve());
    });
  }

  public setRoutes(routes: Routes): this {
    this.routing = new HttpRouting(routes, this.config.baseUrl);
    return this;
  }

  public setLogger(logger: HttpLogger): this {
    this.logger = logger;
    return this;
  }

  public setExceptionHandlers(exceptionHandler: ExceptionHandler): this {
    this.exceptionHandler = exceptionHandler;
    return this;
  }

  private async handleRequest(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { handler, guards, dynamicParams } = this.routing.match(req);
    const requestId = uuidv4();

    this.logger?.info(`Method: ${req.method}, URL: ${req.url}, IP: ${req.socket.remoteAddress}, rid: ${requestId}`);

    if (handler) {
      const context = new RequestContext(requestId);

      try {
        await this.routing.runGuards(guards, { req, res, context });
        await this.handleRouteResponse(handler, req, res, dynamicParams, context);
      } catch(error) {
        this.handleRouteError(res, error as Error);
      }
    } else {
      new ClientErrorResponse(res).status(404).message('Not Found').send();
    }

    this.logger?.info(`rid end: ${requestId}`);
  }

  private async handleRouteResponse(
    handler: RouteHandler,
    req: HttpRequest,
    res: HttpResponse,
    dynamicParams: RouteDynamicParams,
    context: RequestContext
  ): Promise<void> {
    try {
      const response = await handler({ req, res, params: dynamicParams, context });

      new SuccessResponse(res).status(200).send(response);
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
