import { AppModule } from '@packages/ioc';
import { Logger, LOGGER } from './logger';
import { ConfigModule } from '../config';

export class LoggerModule extends AppModule {
  protected imports = [ConfigModule];
  protected declares = [{ map: LOGGER, to: Logger }];
  protected exports = [LOGGER];
}
