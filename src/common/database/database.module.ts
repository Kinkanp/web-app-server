import { createConnection } from './database-connection';
import { APP_CONFIG, AppConfig, ConfigModule } from '../config';
import { AppModule } from '@packages/ioc';
import { DBConnection } from './database.model';
import { ILogger, LOGGER, LoggerModule } from '../logger';

export const DB_CONNECTION = Symbol('DB connection');

export class DatabaseModule extends AppModule<{ [DB_CONNECTION]: DBConnection }> {
  protected imports = [ConfigModule, LoggerModule];

  protected exports = [DB_CONNECTION];

  protected declares = [
    {
      map: DB_CONNECTION,
      to: () => {
        const config = this.inject<AppConfig>(APP_CONFIG);
        const logger = this.inject<ILogger>(LOGGER);

        logger.info('Creating database connection');

        return createConnection(config);
      }
    }
  ];
}
