import * as request from 'supertest';
import { createEndpoint, getHttpServer } from './common';

describe('app', () => {
  const server = getHttpServer();

  test('should handle not existing route', () => {
    return request(server)
      .get(createEndpoint('___NOT_EXISTING_ROUTE___'))
      .expect(404)
      .expect(res => {
        expect(res.body.error).toStrictEqual({
          code: 404,
          message: 'Not Found'
        })
      });
  });

  test('should return app health status', () => {
    return request(server)
      .get(createEndpoint('health'))
      .expect(200)
      .expect(res => {
        expect(res.body.data).toStrictEqual({
          status: 'Healthy'
        })
      })
  });
});