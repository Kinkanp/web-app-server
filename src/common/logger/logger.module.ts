import { AppModule } from '@packages/ioc';
import { Logger, LOGGER } from './logger';
import { ConfigModule } from '../config';

export class LoggerModule extends AppModule {
  protected imports = [ConfigModule];
  protected exports = [LOGGER];

  public register(): void {
    this.bind(LOGGER).to(Logger).inSingletonScope();
  }
}
