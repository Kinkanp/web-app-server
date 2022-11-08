import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Pool } from 'pg';
import { Routes } from '../../common/server';

export function getUserRoutes(connection: Pool): Routes {
  const repository = new UserRepository(connection);
  const service = new UserService(repository);
  const controller = new UserController(service);

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
      handler: (req, res) => controller.findOne(req, res)
    }
  ];
}
