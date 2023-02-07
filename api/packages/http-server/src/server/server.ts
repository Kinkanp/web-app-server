import * as http from 'http';
import {
  HttpServerConfig,
  HttpRequest,
  HttpResponse,
  ExceptionHandler,
  HttpLogger,
  HttpInterceptor, HttpInterceptorParams
} from './server.model';
import { RouteDynamicParams, RouteHandler, Routes } from '../routing/routing.model';
import { HttpRouting } from '../routing/routing';
import { ClientErrorResponse, InternalErrorResponse, SuccessResponse } from '../responses';
import { RequestContext } from '../request-context/request-context';
import { v4 as uuidv4 } from 'uuid';
import { CommonHttpResponse } from '../responses/common/common-response';
import { getIpAddressFromRequest } from '../utils/utils';

export class HttpServer {
  private server: http.Server;
  private routing: HttpRouting;
  private exceptionHandler: ExceptionHandler;
  private logger?: HttpLogger;
  private requestInterceptors: HttpInterceptor[] = [];

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

  public setRequestInterceptor(interceptor: HttpInterceptor): this {
    this.requestInterceptors.push(interceptor);
    return this;
  }

  public setExceptionHandler(exceptionHandler: ExceptionHandler): this {
    this.exceptionHandler = exceptionHandler;
    return this;
  }

  private async handleRequest(req: HttpRequest, res: HttpResponse): Promise<void> {
    const { handler, guards, dynamicParams } = this.routing.match(req);
    const requestId = uuidv4();
    const ip = getIpAddressFromRequest(req);
    const context = new RequestContext({ rid: requestId, ip });

    this.logger?.info(`rid: ${requestId}, Method: ${req.method}, URL: ${req.url}, IP: ${ip}, Time: ${new Date().toISOString()}`);

    if (handler) {
      try {
        await this.routing.runGuards(guards, { req, res, context });
        await this.runInterceptors({ req, context, res });

        if (!res.writableEnded) {
          await this.handleRouteResponse(handler, req, res, dynamicParams, context);
        }
      } catch(error) {
        this.handleRouteError(res, error as Error);
      }
    } else {
      this.sendResponse(new ClientErrorResponse(res).status(404).message('Not Found'))
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
      const data = await handler({ req, res, params: dynamicParams, context });

      this.sendResponse(new SuccessResponse(res).status(200), data)
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
    this.sendResponse(new InternalErrorResponse(res).status(500));
  }

  private sendResponse<T extends number>(response: CommonHttpResponse<T>, data?: unknown): void {
    response.send(data);
    this.logger?.info(`response ${response}`);
  }

  private async runInterceptors(params: HttpInterceptorParams): Promise<void> {
    try {
      console.log('running interceptors');
      if (this.requestInterceptors) {
        const promises = this.requestInterceptors.map(interceptor => interceptor.intercept(params))
        await Promise.all(promises);
      }
    } catch(error) {
      this.logger?.error(`request interceptor error: ${error}`);
    }
  }
}
