import { AppModule } from '../../ioc';
import { getAppConfig } from './config';

export const APP_CONFIG = Symbol('App config');

export class ConfigModule extends AppModule {
  protected exports = [APP_CONFIG];

  public register(): void {
    const config = getAppConfig();

    this.bind(APP_CONFIG).toConstantValue(config);
  }
}
