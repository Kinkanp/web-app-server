// eslint-disable-next-line import/no-restricted-paths
import { UserPublic } from '../../domain/user/user.entity';

export interface IRequestContextValues {
  user: UserPublic;
}
