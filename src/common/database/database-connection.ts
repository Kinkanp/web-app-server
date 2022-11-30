import { DBConnection } from './database.model';
import { PrismaClient } from '@prisma/client';

export const createConnection = (isDev: boolean): DBConnection => {
  return new PrismaClient({
    errorFormat: isDev ? 'colorless' : 'minimal',
  });
}