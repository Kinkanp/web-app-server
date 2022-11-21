import { HttpRequest, HttpResponse } from '../server.model';

export interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string;
  handler: RouteHandler;
}

export type Routes = Route[];

export type RouteHandler = (req: HttpRequest, res: HttpResponse, params: RouteDynamicParams) => Promise<RouteHandlerResponse>;

export type RouteHandlerResponse = Response | void;

export type RouteDynamicParams = string[];

type Response = Array<unknown> | Record<any, any> | string | number;