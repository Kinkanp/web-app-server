import { AppModule } from '@packages/ioc';
import { Logger } from './logger';
import { ConfigModule } from '../config';
import { LOGGER } from './logger.model';

export class LoggerModule extends AppModule {
  protected imports = [ConfigModule];
  protected declares = [{ map: LOGGER, to: Logger }];
  protected exports = [LOGGER];
}
