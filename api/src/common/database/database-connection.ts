import { DBConnection } from './database.model';
import { PrismaClient } from '@prisma/client';
import { AppConfig } from '../config';

export const createConnection = (config: AppConfig): DBConnection => {
  return new PrismaClient({
    errorFormat: config.environment.isDev ? 'colorless' : 'minimal'
  });
};
