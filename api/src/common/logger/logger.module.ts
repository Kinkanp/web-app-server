import { AppModule, injectModule } from '@packages/ioc';
import { APP_CONFIG, ConfigModule } from '../config';
import { ILogger, Logger } from '@packages/logger';

export const LOGGER = Symbol('App logger');

export class LoggerModule extends AppModule<{ [LOGGER]: ILogger }> {
  protected imports = [ConfigModule];
  protected declares = [
    {
      map: LOGGER,
      to: () => {
        const config = injectModule(ConfigModule).import(APP_CONFIG);

        return new Logger({
          logsPath: config.app.logsPath,
          logToConsole: true,
          logToFile: true,
          debug: config.environment.isDev,
        })
      }
    }
  ];
  protected exports = [LOGGER];
}
