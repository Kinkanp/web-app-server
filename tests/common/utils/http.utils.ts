import { Server } from 'http';
import { HTTP_SERVER, HttpModule } from '../../../src/transport/http';
import { injectModule } from '@packages/ioc';

export function getHttpServer(): Server {
  return injectModule(HttpModule).import(HTTP_SERVER).get();
}

export function createEndpoint(url: string): string {
  const baseUrl = '/api';

  return `${baseUrl}/${url}`;
}

export function extractData<T>(body: any): T {
  return body.data as T;
}
