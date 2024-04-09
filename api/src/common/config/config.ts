// import { config } from 'dotenv' Not needed ? ENV vars come from docker
import { AppConfig } from './config.model';
import * as process from 'process';

export function getAppConfig(): AppConfig {
  return Object.freeze({
    database: {
      url: process.env.DB_URL as string
    },
    memoryStorage: {
      url: process.env.MEMORY_STORAGE_URL as string,
      ttlInSeconds: parseInt(process.env.MEMORY_STORAGE_TTL_IN_SECONDS as string),
    },
    app: {
      port: parseInt(process.env.APP_PORT as string, 10),
      baseUrl: process.env.APP_BASE_URL as string,
      jwtSecret: process.env.JWT_SECRET as string,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
      logsPath: process.env.APP_LOGS_PATH as string,
    },
    environment: {
      isDev: process.env.NODE_ENV === 'development'
    }
  });
}
