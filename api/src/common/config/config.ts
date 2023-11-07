import { config } from 'dotenv'
import { AppConfig } from './config.model';
config();

export function getAppConfig(): AppConfig {
  return Object.freeze({
    database: {
      url: process.env.DB_URL as string,
      name: process.env.DB_NAME as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      port: parseInt(process.env.DB_PORT as string, 10) as number,
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
