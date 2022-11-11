import { HttpRequest, HttpResponse } from '../server.model';

export type Routes = Route[];
export type RouteHandler = (req: HttpRequest, res: HttpResponse, params?: string[]) => Promise<void>;

export interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string;
  handler: RouteHandler;
}