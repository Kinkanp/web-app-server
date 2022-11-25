import { IAppModule } from '../../ioc';
import { Container } from 'inversify';
import { getAppConfig } from './config';

export const APP_CONFIG = Symbol('App config');

export class ConfigModule extends IAppModule {
  static register(container: Container): void {
    this.container = container;

    const config = getAppConfig();
    this.container.bind(APP_CONFIG).toConstantValue(config);
  }
}
