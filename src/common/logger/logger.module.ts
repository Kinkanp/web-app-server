import { Container } from 'inversify';
import { IAppModule } from '../../ioc';
import { Logger, LOGGER } from './logger';

export class LoggerModule extends IAppModule {
  static register(container: Container): void {
    this.container = container;

    this.container.bind(LOGGER).to(Logger).inSingletonScope();
  }
}