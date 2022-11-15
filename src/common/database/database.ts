import { DBConnection } from './database.model';
import { Sequelize } from 'sequelize';

interface ConnectParams {
  host: string;
  user: string;
  name: string;
  password: string;
  port: number;
}

export const createConnection = (params: ConnectParams): DBConnection => {
  return new Sequelize({
    dialect: 'postgres',
    username: params.user,
    host: params.host,
    database: params.name,
    password: params.password,
    port: params.port,
    logging: () => {
      // TODO
    }
  });
}