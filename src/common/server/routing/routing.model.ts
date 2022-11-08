import { HttpRequest, HttpResponse } from '../server.model';

export type Routes = Route[];
export type RouteHandler = (req: HttpRequest, res: HttpResponse) => Promise<void>;

export interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string;
  handler: RouteHandler;
}