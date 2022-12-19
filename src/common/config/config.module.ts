import { AppModule } from '@packages/ioc';
import { getAppConfig } from './config';

export const APP_CONFIG = Symbol('App config');

export class ConfigModule extends AppModule {
  protected exports = [APP_CONFIG];
  public declares = [{ map: APP_CONFIG, to: getAppConfig() }]
}
