import { createConnection } from './database-connection';
import { APP_CONFIG, ConfigModule } from '../config';
import { AppModule, injectModule } from '@packages/ioc';
import { DBConnection } from './database.model';
import { LOGGER, LoggerModule } from '../logger';

export const DB_CONNECTION = Symbol('DB connection');

export class DatabaseModule extends AppModule<{ [DB_CONNECTION]: DBConnection }> {
  protected imports = [ConfigModule, LoggerModule];

  protected exports = [DB_CONNECTION];

  protected declares = [
    {
      map: DB_CONNECTION,
      to: () => {
        const config = injectModule(ConfigModule).import(APP_CONFIG);
        const logger = injectModule(LoggerModule).import(LOGGER);

        logger.info('Creating database connection');

        return createConnection(config);
      }
    }
  ];
}
