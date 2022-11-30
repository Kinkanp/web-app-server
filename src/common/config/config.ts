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
    },
    environment: {
      isDev: process.env.NODE_ENV === 'development'
    }
  });
}