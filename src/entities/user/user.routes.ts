import { Routes } from '../../common/http';
import { UserProvider } from './user.provider';
import { ProvidersManager } from '../../common/provider';

export function getUserRoutes(): Routes {
  const { controller } = ProvidersManager.get<UserProvider>(UserProvider);

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
