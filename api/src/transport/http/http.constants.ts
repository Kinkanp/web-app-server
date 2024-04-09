import { UserPublic } from '../../aggregation/user';
import { Controller, HttpInterceptorParams, RequestContextDefaultValues, Routes } from '@packages/http-server';

export type AppRoutes = Routes<HttpContextValues>;
export type AppHttpInterceptorParams = HttpInterceptorParams<HttpContextValues>;
export abstract class AppController extends Controller<HttpContextValues> {}

export interface HttpContextValues extends RequestContextDefaultValues {
  user: UserPublic;
}
