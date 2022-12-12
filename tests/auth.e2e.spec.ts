import { describe, expect, test } from 'vitest';
import request from 'supertest';
import { createEndpoint, expectErrorResponse, extractData, getHttpServer } from './common';
import { User } from '../src/domain/user/user.entity';
import { LocalTestContext } from './common/types';
import { USERS_SEED_CREDENTIALS } from '../seeds/users';
import { AccessTokensResponse, LoginResponse } from '../src/domain/auth';
import { getMultipleRefreshTokensForSingleUser, getValidRefreshToken } from '../seeds/sessions';
import { createAccessToken } from './common/utils/auth.utils';

describe('authorisation', () => {
  const server = getHttpServer();

  describe('registration', () => {
    test('should create new user', async () => {
      const userToCreate = {
        username: '___unique___username___',
        password: 'test-password'
      };

      const {
        body: { data: createdUser }
      } = await request(server).post(createEndpoint('auth/register')).send(userToCreate);
      const res = await request(server).get(createEndpoint(`users/${createdUser.id}`));
      const singleUserResponse = extractData<User>(res.body);

      expect(singleUserResponse).toStrictEqual({
        id: createdUser.id,
        username: userToCreate.username,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      });
    });

    test<LocalTestContext>('should throw error on user with already existing username', ({ seeds }) => {
      const existingUsername = seeds.users[0].username;

      return request(server)
        .post(createEndpoint('auth/register'))
        .send({ username: existingUsername, password: '___123___' })
        .expect(res => expect(res.status).toEqual(400));
    });

    test('should return error on empty input', () => {
      return request(server)
        .post(createEndpoint('auth/register'))
        .send({ })
        .expect(res => expect(res.status).toEqual(400));
    });

    test('should return error on invalid input', () => {
      return request(server)
        .post(createEndpoint('auth/register'))
        .send({ username: '', password: '1' })
        .expect(res => expectErrorResponse(res));
    });
  });

  describe('login', () => {
    test<LocalTestContext>('should successfully login', ({ seeds }) => {
      const user = seeds.users.find(({ username }) => username === USERS_SEED_CREDENTIALS.username)!;

      return request(server)
        .post(createEndpoint('auth/login'))
        .send(USERS_SEED_CREDENTIALS)
        .expect(res => {
          const data = extractData<LoginResponse>(res.body);

          expect(data).toStrictEqual({
            user: {
              id: expect.any(Number),
              username: user.username,
              createdAt: user.createdAt.toISOString(),
              updatedAt: user.updatedAt.toISOString()
            },
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
          });
        });
    });

    test('should return error on non-existing user', () => {
      return request(server)
        .post(createEndpoint('auth/login'))
        .send({ username: 'NOT_EXISTING_USER', password: '12345678' })
        .expect(res => expectErrorResponse(res));
    });

    test<LocalTestContext>('should return error on incorrect password', ({ seeds }) => {
      const [user] = seeds.users;

      return request(server)
        .post(createEndpoint('auth/login'))
        .send({ username: user.username, password: 'INVALID_PASSWORD' })
        .expect(res => expectErrorResponse(res));
    });

    test('should return error on invalid input', () => {
      return request(server)
        .post(createEndpoint('auth/login'))
        .send({ username: '', password: '' })
        .expect(res => expectErrorResponse(res));
    });

    test('should return error on empty input', () => {
      return request(server)
        .post(createEndpoint('auth/login'))
        .send()
        .expect(res => expectErrorResponse(res));
    });

    test<LocalTestContext>('should return valid access token', async () => {
      const loginResponse = await request(server)
        .post(createEndpoint('auth/login'))
        .send(USERS_SEED_CREDENTIALS)
        .expect(200);
      const { accessToken } = extractData<LoginResponse>(loginResponse.body);

      return request(server)
        .get(createEndpoint('users/current'))
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    test('should return valid refresh token', async () => {
      const loginResponse = await request(server)
        .post(createEndpoint('auth/login'))
        .send(USERS_SEED_CREDENTIALS)
        .expect(200);
      const { refreshToken } = extractData<LoginResponse>(loginResponse.body);

      return request(server)
        .post(createEndpoint('auth/refresh'))
        .send({ refreshToken })
        .expect(200);
    });
  });

  describe('refresh', () => {
    test<LocalTestContext>('should create valid tokens pair', async ({ seeds }) => {
      const [token] = getValidRefreshToken();
      const session = seeds.sessions.find(session => session.refreshToken === token)!;

      const refreshResponse = await request(server)
        .post(createEndpoint('auth/refresh'))
        .send({ refreshToken: session.refreshToken });
      const { accessToken, refreshToken } = extractData<AccessTokensResponse>(refreshResponse.body);

      await request(server)
        .get(createEndpoint('users/current'))
        .auth(accessToken, { type: 'bearer' })
        .expect(200)
        .expect(res => {
          const currentUser = extractData<User>(res.body);
          expect(currentUser.id).toStrictEqual(session.userId);
        });

      return request(server)
        .post(createEndpoint('auth/refresh'))
        .send({ refreshToken })
        .expect(200);
    });

    test<LocalTestContext>('should be possible to use refresh token only once', async ({ seeds }) => {
      const [token] = getValidRefreshToken();
      const session = seeds.sessions.find(session => session.refreshToken === token)!;

      await request(server)
        .post(createEndpoint('auth/refresh'))
        .send({ refreshToken: session.refreshToken })
        .expect(200);

      return request(server)
        .post(createEndpoint('auth/refresh'))
        .send({ refreshToken: session.refreshToken })
        .expect(res => expectErrorResponse(res, 400));
    });

    test('should return error on invalid refresh token', () => {
      return request(server)
        .post(createEndpoint('auth/refresh'))
        .send({ refreshToken: 'invalid' })
        .expect(res => expectErrorResponse(res, 400));
    });

    test<LocalTestContext>('should be possible to use multiple refresh tokens for the same user', async ({ seeds }) => {
      const refreshTokensToValidate = getMultipleRefreshTokensForSingleUser(3);

      const tokensValidation = refreshTokensToValidate.map(token => {
        const session = seeds.sessions.find(session => session.refreshToken === token)!;

        return request(server)
          .post(createEndpoint('auth/refresh'))
          .send({ refreshToken: session.refreshToken })
          .expect(200);
      });

      return Promise.all(tokensValidation);
    })
  });

  describe('logout', () => {
    test<LocalTestContext>('should invalidate user refresh token', async ({ seeds }) => {
      const [refreshToken] = getValidRefreshToken();
      const session = seeds.sessions.find(session => session.refreshToken === refreshToken)!;
      const accessToken = createAccessToken(session.userId);

      await request(server)
        .post(createEndpoint('auth/logout'))
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      return request(server)
        .post(createEndpoint('auth/refresh'))
        .expect(400);
    });

    test<LocalTestContext>('should invalidate user refresh tokens from all sessions', async ({ seeds }) => {
      const refreshTokens = getMultipleRefreshTokensForSingleUser(2);
      const [refreshTokenToInvalidate] = refreshTokens;
      const session = seeds.sessions.find(session => session.refreshToken === refreshTokenToInvalidate)!;
      const accessToken = createAccessToken(session.userId);

      await request(server)
        .post(createEndpoint('auth/logout'))
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      const refreshTokensValidation = refreshTokens.map(() => {
        return request(server)
          .post(createEndpoint('auth/refresh'))
          .expect(400);
      });

      return Promise.all(refreshTokensValidation);
    });

    test<LocalTestContext>('should return error on expired access token', ({ seeds }) => {
      const [refreshToken] = getValidRefreshToken();
      const session = seeds.sessions.find(session => session.refreshToken === refreshToken)!;
      const accessToken = createAccessToken(session.userId, { expiresIn: '1ms' });

      return request(server)
        .post(createEndpoint('auth/logout'))
        .auth(accessToken, { type: 'bearer' })
        .expect(401);
    });
  });
});
