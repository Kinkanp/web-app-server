import { AuthGuardModule } from './auth/auth-guard.module';
import { AppModule } from '../../../ioc';

export * from './auth/auth-guard.module';

export function getGuardModules() {
  return [AuthGuardModule];
}
