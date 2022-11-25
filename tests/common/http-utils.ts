import { Server } from 'http';
import { HttpModule } from '../../src/transport/http';

export function getHttpServer(): Server {
  return HttpModule.getServer().get();
}

export function createEndpoint(url: string): string {
  const baseUrl = '/api';

  return `${baseUrl}/${url}`;
}

export function extractData<T>(body: any): T {
  return body.data as T;
}