import { UserPublic } from '../../aggregation/user';
import { Controller, RequestContextDefaultValues, Routes } from '@packages/http-server';

export type AppRoutes = Routes<RequestContextValues>;
export abstract class AppController extends Controller<RequestContextValues> {}

export interface RequestContextValues extends RequestContextDefaultValues {
  user: UserPublic;
}
