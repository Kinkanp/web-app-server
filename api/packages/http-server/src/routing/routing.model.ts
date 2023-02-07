import { HttpRequest, HttpResponse } from '../server';
import { RequestContext } from '../request-context/request-context';

export type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Route<TRequestContext = unknown> {
  method: HttpRequestMethod,
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
  allow(params: GuardParams<any>): Promise<boolean | void>;
}

export abstract class Controller<TRequestContext> {
  abstract getRoutes(): Routes<TRequestContext>;
}

type Response = Array<unknown> | Record<any, any> | string | number;

interface RouteHandlerArgs<TRequestContext = unknown> {
  req: HttpRequest;
  res: HttpResponse;
  params: RouteDynamicParams;
  context: RequestContext<TRequestContext>;
}
