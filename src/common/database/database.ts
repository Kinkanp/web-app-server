import { Pool } from 'pg';

interface ConnectParams {
  host: string;
  user: string;
  name: string;
  password: string;
  port: number;
}

export const createConnection = (params: ConnectParams): Pool => {
  return new Pool({
    user: params.user,
    host: params.host,
    database: params.name,
    password: params.password,
    port: params.port,
  });
}