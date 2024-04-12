import * as http from 'http';
import {
  HttpServerConfig,
  HttpRequest,
  HttpResponse,
  ExceptionHandler,
  HttpLogger,
  HttpInterceptor,
  HttpInterceptorParams
} from './server.model';
import { RouteHandlerResponse, Routes } from '../routing/routing.model';
import { HttpRouting } from '../routing/routing';
import { ClientErrorResponse, InternalErrorResponse, SuccessResponse } from '../responses';
import { RequestContext, RequestContextDefaultValues } from '../request-context/request-context';
import { v4 as uuidv4 } from 'uuid';
import { CommonHttpResponse } from '../responses/common/common-response';
import { getIpAddressFromRequest } from '../utils/utils';
import { HttpInterceptorHandle } from './interceptor-handle';

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
    this.server = http.createServer(async (req, res) => {
      const context = this.createRequestContext(req);

      this.logger?.info(`rid: ${context.get('rid')}, ${req.method} ${req.url}, IP: ${context.get('ip')}, Time: ${new Date().toISOString()}`);
      await this.handleRequest(req, res, context);
      this.logger?.info(`rid end: ${context.get('rid')}`);
    });
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

  private async handleRequest(req: HttpRequest, res: HttpResponse, context: RequestContext): Promise<void> {
    const { handler, guards, dynamicParams, options } = this.routing.match(req);

    if (handler) {
      try {
        const handle = new HttpInterceptorHandle(() => handler({ req, res, params: dynamicParams, context }));

        await this.routing.runGuards(guards, { req, res, context });

        const routeResponse = this.requestInterceptors.length ?
          this.runInterceptors({ req, context, res, routeOptions: options }, handle) :
          handle.run();

        await this.handleRouteResponse(res, routeResponse);
      } catch(error) {
        this.handleRouteError(res, error as Error);
      }
    } else {
      this.sendResponse(new ClientErrorResponse(res).status(404).message('Not Found'))
    }
  }

  private async handleRouteResponse(res: HttpResponse, routeResponse: Promise<RouteHandlerResponse>): Promise<void> {
    try {
      const data = await routeResponse;

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

  private async runInterceptors(params: HttpInterceptorParams, handle: HttpInterceptorHandle): Promise<RouteHandlerResponse> {
    try {
      let result = await handle.run();

      for (const interceptor of this.requestInterceptors) {
        const interceptedHandle = new HttpInterceptorHandle(() => Promise.resolve(result));
        result = await interceptor.intercept(params, interceptedHandle);
      }

      return result;
    } catch(error) {
      this.logger?.error(`request interceptor error: ${error}`);
      return Promise.reject(error);
    }
  }

  private createRequestContext(req: HttpRequest): RequestContext<RequestContextDefaultValues> {
    const requestId = uuidv4();
    const ip = getIpAddressFromRequest(req);

    return new RequestContext({ rid: requestId, ip });
  }
}
