import * as http from 'http';

export interface HttpServerConfig {
  port: number;
  baseUrl: string;
}

export type HttpRequest = http.IncomingMessage;
export type HttpResponse = http.ServerResponse;

