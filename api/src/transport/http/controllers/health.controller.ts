import { injectable } from 'inversify';
import { AppController, AppRoutes } from '../http.constants';

@injectable()
export class HealthController implements AppController {
  public getRoutes(): AppRoutes {
    return [
      {
        path: 'health',
        method: 'GET',
        handler: async () => ({ status: 'Ok' })
      }
    ];
  }
}
