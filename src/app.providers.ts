import { EntityProviderConstructor } from './common/provider';
import { UserProvider } from './entities/user/user.provider';

export function getAppProviders(): EntityProviderConstructor[]  {
  return [
    UserProvider
  ];
}