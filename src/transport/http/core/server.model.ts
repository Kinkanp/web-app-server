import * as http from 'http';
import { CommonErrorResponse } from './responses/common/error-response';

export interface HttpServerConfig {
  port: number;
  baseUrl: string;
}

export type HttpRequest = http.IncomingMessage;
export type HttpResponse = http.ServerResponse;

export type CustomErrorHandler = (res: HttpResponse, error: Error) => CommonErrorResponse<number> | void;