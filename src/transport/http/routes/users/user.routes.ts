import { Routes } from '../../core';
import { UsersModule } from '../../../../aggregation/users';
import { UserController } from './user.controller';

export function getUserRoutes(): Routes {
  const controller = new UserController(UsersModule.service);

  return [
    {
      path: '/health',
      method: 'GET',
      handler: async (req, res) => {
        res.end('Health');
      }
    },
    {
      path: '/users',
      method: 'POST',
      handler: (req) => controller.create(req)
    },
    {
      path: '/users',
      method: 'GET',
      handler: (req) => controller.list(req)
    },
    {
      path: '/users/test',
      method: 'GET',
      handler: (req, res) => controller.test(req, res)
    },
    {
      path: '/users/:id',
      method: 'GET',
      handler: (req, res, [id]) => controller.findOne(req, res, id)
    }
  ];
}
