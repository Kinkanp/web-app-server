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

  test('should create new user', async () => {
    const userToCreate = {
      firstName: 'new_user_test___firstName',
      lastName: 'new_user_test___lastName'
    }

    const {
      body: { data: createdUser }
    } = await request(server).post(createEndpoint('users')).send(userToCreate);
    const res = await request(server).get(createEndpoint(`users/${createdUser.id}`));
    const singleUserResponse = extractData<User>(res.body);

    expect(singleUserResponse).toStrictEqual({
      id: createdUser.id,
      firstName: userToCreate.firstName,
      lastName: userToCreate.lastName,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
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
});
