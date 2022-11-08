import { config } from 'dotenv'
import { AppConfigModel, Config } from './config.model';
config();

export class AppConfig implements AppConfigModel {
  private readonly config: Config;

  constructor() {
    this.config = Object.freeze({
      database: {
        host: process.env.DB_HOST as string,
        user: process.env.DB_USER as string,
        name: process.env.DB_DATABASE as string,
        password: process.env.DB_PASSWORD as string,
        port: parseInt(process.env.DB_PORT as string)
      },
      app: {
        port: parseInt(process.env.APP_PORT as string)
      }
    });
  }

  public get(): Config {
    return this.config;
  }
}