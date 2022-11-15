import { Routes } from '../../core';
import { UsersAggregator } from '../../../../aggregation/users';
import { UserController } from './user.controller';

export function getUserRoutes(): Routes {
  const controller = new UserController(UsersAggregator.service);

  return [
    {
      path: '/users',
      method: 'POST',
      handler: (req, res) => controller.create(req, res)
    },
    {
      path: '/users',
      method: 'GET',
      handler: (req, res) => controller.list(req, res)
    },
    {
      path: '/users/:id',
      method: 'GET',
      handler: (req, res, [id]) => controller.findOne(req, res, id)
    }
  ];
}
