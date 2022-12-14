import { PrismaClient } from '@prisma/client';
import { getUsersSeed } from './users';
import { User } from '../src/domain/user/user.entity';
import { getSessionsSeed } from './sessions';
import { Session } from '../src/domain/auth';

const connection = new PrismaClient();

export interface Seeds {
  users: User[];
  sessions: Session[];
}

async function createSeeds(): Promise<Seeds> {
  const users = await getUsersSeed(connection) as User[];
  const sessions = await getSessionsSeed(connection, users);

  return { users, sessions };
}

export async function runSeeds(): Promise<Seeds> {
  const seeds = await createSeeds();

  return connection.$disconnect()
    .then(() => seeds)
    .catch(async (e :any) => {
      console.error(e)
      await connection.$disconnect();
      process.exit(1);
    });
}

export async function clearSeeds(): Promise<number> {
  return connection.$executeRaw`
    TRUNCATE TABLE users CASCADE;
  `;
}
