import { config } from 'dotenv'
import { AppConfig } from './config.model';
config();

export function getAppConfig(): AppConfig {
  return Object.freeze({
    database: {
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      name: process.env.DB_DATABASE as string,
      password: process.env.DB_PASSWORD as string,
      port: parseInt(process.env.DB_PORT as string)
    },
    app: {
      port: parseInt(process.env.APP_PORT as string),
      baseUrl: process.env.APP_BASE_URL as string,
    }
  });
}