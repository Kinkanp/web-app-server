import { Guard, MatchRouteResult, Routes, GuardParams } from './routing.model';
import { HttpRequest } from '../server';
import { ROUTING_ID_SIGN } from './routing.constants';

export class HttpRouting {
  constructor(private routes: Routes, private baseUrl: string) {
    this.setBaseUrl();
  }

  // TODO: add condition for '*' route
  public match(req: HttpRequest): MatchRouteResult {
    const [urlWithoutQuery] = req.url?.split('?') || [''];
    const reqUrlParts = urlWithoutQuery.split('/');
    const dynamicParams: string[] = [];

    const route = this.routes
    .filter(({ method }) => req.method === method)
    .find(({ path }) => {
      const pathParts = path.split('/');

      if (pathParts.length !== reqUrlParts?.length) {
        return false;
      }

      return pathParts.every((part, i) => {
        [part] = part.split('?');

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
      options: route?.options,
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
