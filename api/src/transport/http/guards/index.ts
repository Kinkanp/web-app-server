import { AuthGuardModule } from './auth/auth-guard.module';

export * from './auth/auth-guard.module';

export function getGuardModules() {
  return [AuthGuardModule];
}
