import { HttpRequest, HttpResponse } from '../server.model';
import { RequestContext } from '../request-context';

export interface Route<TRequestContext = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string;
  handler: RouteHandler<TRequestContext>;
  guards?: Guard[];
}

export type Routes<TRequestContext = unknown> = Route<TRequestContext>[];

export type RouteHandler<TRequestContext = unknown> = (args: RouteHandlerArgs<TRequestContext>) => Promise<RouteHandlerResponse>;

export type RouteHandlerResponse = Response | void;

export type RouteDynamicParams = string[];

export interface MatchRouteResult {
  handler?: RouteHandler;
  guards?: Guard[];
  dynamicParams: string[];
}

export interface GuardParams<TRequestContext = unknown> {
  context: RequestContext<TRequestContext>;
  req: HttpRequest,
  res: HttpResponse;
}

export interface Guard {
  allow(params: GuardParams): Promise<boolean | void>;
}

type Response = Array<unknown> | Record<any, any> | string | number;

interface RouteHandlerArgs<TRequestContext = unknown> {
  req: HttpRequest;
  res: HttpResponse;
  params: RouteDynamicParams;
  context: RequestContext<TRequestContext>;
}
