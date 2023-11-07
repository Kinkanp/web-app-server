import request from 'supertest';
import { describe, test, expect } from 'vitest';
import { createEndpoint, extractData, getHttpServer, expectValidDate, expectErrorResponse } from './common';
import { User } from '../src/domain/user/user.entity';
import { createAccessToken } from './common/utils/auth.utils';
import { LocalTestContext } from './common/types';

describe('users', () => {
  const server = getHttpServer();

  describe('users list', () => {
    test('should return array', () => {
      return request(server)
        .get(createEndpoint('users'))
        .expect(200)
        .expect(res => {
          const data = extractData<User[]>(res.body);
          expect(data.length).toEqual(expect.any(Number))
        });
    });

    test('should return list of users', () => {
      return request(server)
        .get(createEndpoint('users'))
        .expect(200)
        .expect(res => {
          const [user] = extractData<User[]>(res.body);

          expect(user).toStrictEqual({
            id: expect.any(Number),
            username: expect.any(String),
            createdAt: expectValidDate(user.createdAt),
            updatedAt: expectValidDate(user.updatedAt)
          });
        });
    });
  });

  test('should find user by id', async () => {
    const res = await request(server).get(createEndpoint('users'));
    const [userToFind] = extractData<User[]>(res.body).reverse();

    return request(server)
      .get(createEndpoint(`users/${userToFind.id}`))
      .expect(200)
      .expect(res => {
        const user = extractData<User>(res.body);

        expect(user).toStrictEqual(userToFind);
      });
  });

  describe('current user', () => {
    test<LocalTestContext>('should return logged in user', ({ seeds }) => {
      const [user] = seeds.users;
      const token = createAccessToken(user.id);

      return request(server)
        .get(createEndpoint('users/current'))
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect(res => {
          const currentUser = extractData<User>(res.body);
          expect(currentUser).toStrictEqual({
            id: user.id,
            username: user.username,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
          });
        });
    });

    test<LocalTestContext>('should return error if access token is expired', ({ seeds }) => {
      const [user] = seeds.users;
      const token = createAccessToken(user.id, { expiresIn: '1ms' });

      return request(server)
        .get(createEndpoint('users/current'))
        .auth(token, { type: 'bearer' })
        .expect(res => expectErrorResponse(res, 401));
    });

    test('should return error if access token is not provided', () => {
      return request(server)
        .get(createEndpoint('users/current'))
        .expect(res => expectErrorResponse(res, 401));
    });
  });
});
