import { PrismaClient } from '@prisma/client';
import { getUsersSeed } from './users';
import { User } from '../src/domain/user/user.entity';
import { getSessionsSeed } from './sessions';
import { Session } from '../src/domain/auth';
import { getPostsSeed, PostsSeed } from './posts';

const connection = new PrismaClient();

export interface Seeds {
  users: User[];
  sessions: Session[];
  postsWithUsers: PostsSeed;
}

async function createSeeds(): Promise<Seeds> {
  const users = await getUsersSeed(connection) as User[];
  const sessions = await getSessionsSeed(connection, users);
  const postsWithUsers = await getPostsSeed(connection, users);

  return { users, sessions, postsWithUsers };
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
  // TODO: clean all tables at once
  return connection
          .$executeRaw`DELETE FROM sessions`
          .then(() => connection.$executeRaw`DELETE FROM posts`)
          .then(() => connection.$executeRaw`DELETE FROM users`);
}
