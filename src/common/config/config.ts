import { config } from 'dotenv'
import { AppConfig } from './config.model';
config();

export function getAppConfig(): AppConfig {
  return Object.freeze({
    database: {
      url: process.env.DATABASE_URL as string
    },
    app: {
      port: parseInt(process.env.APP_PORT as string),
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
