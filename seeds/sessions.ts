import { PrismaClient, SessionModel, UserModel } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { useDataOnce } from './utils';

const REFRESH_TOKENS = [
  uuidv4(),
  uuidv4(),
  uuidv4(),
  uuidv4(),
];

const ONE_USER_REFRESH_TOKENS: string[] = [
  uuidv4(),
  uuidv4(),
  uuidv4(),
  uuidv4(),
  uuidv4(),
];

export const getValidRefreshToken = useDataOnce(REFRESH_TOKENS);
export const getMultipleRefreshTokensForSingleUser = useDataOnce(ONE_USER_REFRESH_TOKENS);


export function getSessionsSeed(
  connection: PrismaClient, users: UserModel[]
): Promise<SessionModel[]> {
  const userIdWithSingleSession = users[0].id;
  const userIdWithMultipleSessions = users[1].id;

  const sessionsToCreate = [
    ...REFRESH_TOKENS.map(token => {
      return create(connection, userIdWithSingleSession, token);
    }),
    ...ONE_USER_REFRESH_TOKENS.map(token => {
      return create(connection, userIdWithMultipleSessions, token);
    })
  ]

  return Promise.all(sessionsToCreate);
}

function create(connection: PrismaClient, userId: number, refreshToken: string): Promise<SessionModel> {
  return connection.sessionModel.create({
    data: {
      userId: userId,
      refreshToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })
}
