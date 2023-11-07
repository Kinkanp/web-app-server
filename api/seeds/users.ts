import { PrismaClient, UserModel } from '@prisma/client';
import { getRandomNumber, hash } from './utils';

export const USERS_SEED_CREDENTIALS = {
  username: 'test_user',
  password: 'SEED_RAW_PASSWORD'
};

export async function getUsersSeed(connection: PrismaClient, quantity = 5): Promise<UserModel[]> {
  const users: UserModel[] = [];

  for (let i = 0; i < quantity - 1; i++) {
    const number = getRandomNumber();
    const user = await create(connection, {
      username: `username-${number}`,
      password: `password-${number}`
    });

    users.push(user);
  }

  const user = await create(connection, USERS_SEED_CREDENTIALS);
  users.push(user);

  return users;
}

async function create(connection: PrismaClient, params: { username: string; password: string }): Promise<UserModel> {
  const data = {
    username: params.username,
    password: await hash(params.password, 8),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return connection.userModel.create({ data });
}
