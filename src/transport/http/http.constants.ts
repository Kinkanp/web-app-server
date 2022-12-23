import { UserPublic } from '../../aggregation/user';
import { RequestContextDefaultValues, Routes } from '@packages/http-server';

export type AppRoutes = Routes<RequestContextValues>;

export interface RequestContextValues extends RequestContextDefaultValues {
  user: UserPublic;
}
