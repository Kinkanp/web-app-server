import * as http from 'http';
import { BaseError } from '../../../common/errors';

export interface HttpServerConfig {
  port: number;
  baseUrl: string;
}

export type HttpRequest = http.IncomingMessage;
export type HttpResponse = http.ServerResponse;

export abstract class ExceptionHandler {
  abstract handle(res: HttpResponse, error: BaseError): void;
}