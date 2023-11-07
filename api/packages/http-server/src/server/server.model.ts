import * as http from 'http';

export interface HttpServerConfig {
  port: number;
  baseUrl: string;
}

export type HttpRequest = http.IncomingMessage;
export type HttpResponse = http.ServerResponse;

export abstract class ExceptionHandler {
  abstract handle(res: HttpResponse, error: ExceptionHandlerError): void;
}

export interface HttpLogger {
  info(...message: any[]): void;
  debug(...message: any[]): void;
}

interface ExceptionHandlerError {
  message: string | string[];
}
