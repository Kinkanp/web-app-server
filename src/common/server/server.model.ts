import * as http from 'http';

export interface AppServerConfig {
  port: number;
}

export type HttpRequest = http.IncomingMessage;
export type HttpResponse = http.ServerResponse;

