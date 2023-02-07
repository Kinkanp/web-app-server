import * as http from 'http';
import { RequestContext } from '../request-context/request-context';
import { RouteHandlerResponse } from '../routing';

export interface HttpServerConfig {
  port: number;
  baseUrl: string;
}

export type HttpRequest = http.IncomingMessage;
export type HttpResponse = http.ServerResponse;

export interface HttpLogger {
  info(...message: any[]): void;
  error(...message: any[]): void;
  debug(...message: any[]): void;
}

export abstract class ExceptionHandler {
  abstract handle(res: HttpResponse, error: ExceptionHandlerError): void;
}

export abstract class HttpInterceptor {
  abstract intercept(params: HttpInterceptorParams): Promise<RouteHandlerResponse>;
}

export interface HttpInterceptorParams<T = any> {
  res: HttpResponse;
  req: HttpRequest;
  context: RequestContext<T>;
}

interface ExceptionHandlerError {
  message: string | string[];
}
