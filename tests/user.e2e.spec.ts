import * as request from 'supertest';
import { createEndpoint, extractData, getHttpServer, expectValidDate } from './common';
import { User } from '../src/domain/user/user.entity';

describe('users', () => {
  const server = getHttpServer();

  describe('users list', () => {
    test('result should be an array', () => {
      return request(server)
        .get(createEndpoint('users'))
        .expect(200)
        .expect(res => {
          const data = extractData<User[]>(res.body);
          expect(data.length).toEqual(expect.any(Number))
        });
    });

    test('list should consist of users', () => {
      return request(server)
        .get(createEndpoint('users'))
        .expect(200)
        .expect(res => {
          const [user] = extractData<User[]>(res.body);

          expect(user).toStrictEqual({
            id: expect.any(Number),
            firstName: expect.any(String),
            lastName: expect.any(String),
            createdAt: expectValidDate(user.createdAt),
            updatedAt: expectValidDate(user.updatedAt)
          });
        });
    });
  });
});
