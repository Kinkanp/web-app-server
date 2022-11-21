import { inject } from 'light-my-request';
import { getHttpRequest } from './common';

describe('user', () => {
  test('should return a list users', () => {
    return inject(getHttpRequest())
      .get('/api/users')
      .then(res => expect(res.payload).toBeTruthy());
  });
});
