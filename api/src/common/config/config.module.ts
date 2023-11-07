import { AppModule } from '@packages/ioc';
import { getAppConfig } from './config';
import { AppConfig } from './config.model';

export const APP_CONFIG = Symbol('App config');

export class ConfigModule extends AppModule<{ [APP_CONFIG]: AppConfig }> {
  protected exports = [APP_CONFIG];
  public declares = [{ map: APP_CONFIG, to: getAppConfig() }]
}
