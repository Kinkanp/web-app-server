import { UserPublic } from '../../aggregation/user';
import { Routes } from '@packages/http-server';

export type AppRoutes = Routes<RequestContextValues>;

export interface RequestContextValues {
  user: UserPublic;
}
