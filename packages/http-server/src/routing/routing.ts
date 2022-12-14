import { Guard, MatchRouteResult, Routes, GuardParams } from './routing.model';
import { HttpRequest } from '../server';
import { ROUTING_ID_SIGN } from './routing.constants';

export class HttpRouting {
  constructor(private routes: Routes, private baseUrl: string) {
    this.setBaseUrl();
  }

  // TODO: add condition for '*' route
  public match(req: HttpRequest): MatchRouteResult {
    const reqUrlParts = req.url?.split('/');
    const dynamicParams: string[] = [];

    const route = this.routes
    .filter(({ method }) => req.method === method)
    .find(({ path }) => {
      const pathParts = path.split('/');

      if (pathParts.length !== reqUrlParts?.length) {
        return false;
      }

      return pathParts.every((part, i) => {
        if (part === reqUrlParts[i]) {
          return true;
        }

        if (part.includes(ROUTING_ID_SIGN)) {
          dynamicParams.push(reqUrlParts[i]);
          return true;
        }

        return false;
      });
    });

    return {
      handler: route?.handler,
      guards: route?.guards,
      dynamicParams
    };
  }

  public runGuards(guards: Guard[] = [], params: GuardParams): Promise<void> {
    const promises = guards.map(guard => guard.allow(params));

    return Promise.all(promises).then();
  }

  private setBaseUrl(): void {
    this.routes = this.routes.map(route => ({ ...route, path: `${this.baseUrl}${route.path}` }));
  }
}
